import slugify from "slugify";
import { isMongoReady } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";
import { Review } from "../models/Review.js";
import { memory, makeId, clone } from "../data/memoryStore.js";
import { getPagination, paginateArray } from "../utils/pagination.js";
import { badRequest, notFound } from "../utils/httpError.js";

const normalizeFormatType = (formatType = "online") => {
  const map = {
    remote: "zoom",
    oncampus: "offline",
  };
  return map[formatType] || formatType || "online";
};

function normalizeCourse(course) {
  const raw = course?.toJSON ? course.toJSON() : course;
  return clone({
    ...raw,
    formats: (raw.formats || []).map((format) => ({
      ...format,
      formatType: normalizeFormatType(format.formatType),
    })),
  });
}

export async function listCourses(query = {}, { admin = false } = {}) {
  if (isMongoReady()) {
    const { page, limit, skip } = getPagination(query);
    const filter = admin ? {} : { isPublished: true };
    const [results, totalResults] = await Promise.all([
      Course.find(filter).populate("categoryId").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter),
    ]);
    return { results: results.map(normalizeCourse), page, limit, totalResults, totalPages: Math.ceil(totalResults / limit) || 1 };
  }

  const items = memory.courses.filter((course) => admin || course.isPublished);
  return paginateArray(items.map(normalizeCourse), query);
}

export async function getCourse(courseId) {
  if (isMongoReady()) {
    const course = await Course.findById(courseId).populate("categoryId");
    if (!course) throw notFound("Không tìm thấy khóa học.");
    return normalizeCourse(course);
  }

  const course = memory.courses.find((item) => item.id === courseId);
  if (!course) throw notFound("Không tìm thấy khóa học.");
  return normalizeCourse(course);
}

export async function createCourse(payload) {
  if (!payload.title || !payload.categoryId || !payload.basePrice) {
    throw badRequest("Thiếu tiêu đề, ngành hoặc giá khóa học.");
  }

  const formats = (payload.formats || []).map((format) => ({
    ...format,
    formatType: normalizeFormatType(format.formatType),
  }));

  if (isMongoReady()) {
    const category = await Category.findById(payload.categoryId);
    if (!category) throw badRequest("Danh mục không hợp lệ.");
    const course = await Course.create({
      ...payload,
      formats,
      slug: payload.slug || slugify(payload.title, { lower: true, strict: true }),
    });
    return normalizeCourse(await course.populate("categoryId"));
  }

  const category = memory.categories.find((item) => item.id === payload.categoryId);
  if (!category) throw badRequest("Danh mục không hợp lệ.");
  const course = {
    id: makeId("course"),
    ...payload,
    slug: payload.slug || slugify(payload.title, { lower: true, strict: true }),
    categoryId: category,
    formats,
    requiredSkills: payload.requiredSkills || [],
    isPublished: payload.isPublished !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memory.courses.push(course);
  return normalizeCourse(course);
}

export async function updateCourse(courseId, payload) {
  const allowed = { ...payload };
  if (allowed.title && !allowed.slug) {
    allowed.slug = slugify(allowed.title, { lower: true, strict: true });
  }

  if (allowed.categoryId) {
    const category = isMongoReady()
      ? await Category.findById(allowed.categoryId)
      : memory.categories.find((item) => item.id === allowed.categoryId);
    if (!category) throw badRequest("Danh mục không hợp lệ.");
    if (!isMongoReady()) {
      allowed.categoryId = category;
    }
  }

  if (allowed.formats) {
    allowed.formats = (allowed.formats || []).map((format) => ({
      ...format,
      formatType: normalizeFormatType(format.formatType),
    }));
  }

  if (isMongoReady()) {
    const course = await Course.findByIdAndUpdate(courseId, allowed, { new: true }).populate("categoryId");
    if (!course) throw notFound("Không tìm thấy khóa học.");
    return normalizeCourse(course);
  }

  const course = memory.courses.find((item) => item.id === courseId);
  if (!course) throw notFound("Không tìm thấy khóa học.");
  Object.assign(course, allowed, { updatedAt: new Date().toISOString() });
  return normalizeCourse(course);
}

export async function listCourseReviews(courseId, query = {}) {
  if (isMongoReady()) {
    const { page, limit, skip } = getPagination(query);
    const [results, totalResults] = await Promise.all([
      Review.find({ courseId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments({ courseId }),
    ]);
    return { results: results.map((item) => item.toJSON()), page, limit, totalResults, totalPages: Math.ceil(totalResults / limit) || 1 };
  }

  const reviews = memory.reviews.filter((item) => item.courseId === courseId);
  return paginateArray(reviews, query);
}

export async function createCourseReview(courseId, payload, user) {
  await getCourse(courseId);
  const rating = Number(payload.rating);
  if (!rating || rating < 1 || rating > 5 || !payload.comment) {
    throw badRequest("Vui lòng nhập rating 1-5 và nội dung đánh giá.");
  }

  if (isMongoReady()) {
    const review = await Review.create({
      courseId,
      userId: user?.id || user?._id || null,
      authorName: payload.authorName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Học viên",
      rating,
      comment: payload.comment,
    });
    return review.toJSON();
  }

  const review = {
    id: makeId("review"),
    courseId,
    userId: user?.id || null,
    authorName: payload.authorName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Học viên",
    rating,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  };
  memory.reviews.unshift(review);
  return clone(review);
}
