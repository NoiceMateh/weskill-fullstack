import { isMongoReady } from "../config/db.js";
import { Enrollment } from "../models/Enrollment.js";
import { memory, makeId, clone } from "../data/memoryStore.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { getCourse } from "./courseService.js";

export const normalizeFormatType = (formatType = "online") => {
  const map = {
    remote: "zoom",
    oncampus: "offline",
  };
  return map[formatType] || formatType || "online";
};

const getFormatPrice = (course, formatType) => {
  const normalizedFormat = normalizeFormatType(formatType);
  const formats = Array.isArray(course.formats) ? course.formats : [];
  const format = formats.find((item) => normalizeFormatType(item.formatType) === normalizedFormat && item.isActive !== false);

  if (!format && normalizedFormat !== "online" && formats.length) {
    throw badRequest("Hình thức học không khả dụng cho khóa học này.");
  }

  return Number(format?.priceOverride ?? course.basePrice ?? 0);
};

export function makeProgressEntry(completed) {
  const isCompleted = Boolean(completed);
  return {
    completed: isCompleted,
    completedAt: isCompleted ? new Date() : null,
  };
}

export async function listMyEnrollments(userId) {
  if (isMongoReady()) {
    const enrollments = await Enrollment.find({ userId }).populate("courseId").sort({ createdAt: -1 });
    return enrollments.map((item) => item.toJSON());
  }

  return clone(memory.enrollments.filter((item) => item.userId === userId));
}

export async function createEnrollment(userId, payload) {
  const courseId = payload.courseId || payload.cohortId;
  if (!courseId) throw badRequest("Thiếu courseId hoặc cohortId.");

  const course = await getCourse(courseId);
  const formatType = normalizeFormatType(payload.formatType || "online");
  const paymentModel = payload.paymentModel || "upfront";
  const finalPrice = getFormatPrice(course, formatType);
  const monthlyPrice = paymentModel === "installment" ? Math.ceil(finalPrice / 6) : null;

  if (isMongoReady()) {
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      cohortId: payload.cohortId || "",
      paymentModel,
      formatType,
      finalPrice,
      monthlyPrice,
      status: "pending_payment",
    });
    return enrollment.toJSON();
  }

  const enrollment = {
    id: makeId("enrollment"),
    userId,
    courseId,
    cohortId: payload.cohortId || "",
    paymentModel,
    formatType,
    finalPrice,
    monthlyPrice,
    status: "pending_payment",
    progress: {},
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memory.enrollments.push(enrollment);
  return clone(enrollment);
}

export async function listEnrollments(query = {}) {
  const search = String(query.search || "").trim().toLowerCase();
  const filterStatus = query.status;

  if (isMongoReady()) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    if (filterStatus) filter.status = filterStatus;
    if (search) {
      filter.$or = [{ cohortId: { $regex: search, $options: "i" } }];
    }

    const [results, totalResults] = await Promise.all([
      Enrollment.find(filter).populate("courseId").populate("userId").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Enrollment.countDocuments(filter),
    ]);
    return { results: results.map((item) => item.toJSON()), page, limit, totalResults, totalPages: Math.ceil(totalResults / limit) || 1 };
  }

  let items = memory.enrollments.map((item) => clone(item));
  if (filterStatus) items = items.filter((item) => item.status === filterStatus);
  if (search) {
    items = items.filter((item) => `${item.cohortId}`.toLowerCase().includes(search));
  }
  return paginateArray(items, query);
}

export async function updateEnrollmentStatus(enrollmentId, payload) {
  const allowed = {};
  if (payload.status) {
    const validStatuses = ["pending_payment", "active", "completed", "cancelled"];
    if (!validStatuses.includes(payload.status)) {
      throw badRequest("Trạng thái không hợp lệ.");
    }
    allowed.status = payload.status;
  }
  if (!Object.keys(allowed).length) {
    throw badRequest("Không có dữ liệu cập nhật hợp lệ.");
  }

  if (isMongoReady()) {
    const enrollment = await Enrollment.findByIdAndUpdate(enrollmentId, allowed, { new: true }).populate("courseId").populate("userId");
    if (!enrollment) throw notFound("Không tìm thấy ghi danh.");
    return enrollment.toJSON();
  }

  const enrollment = memory.enrollments.find((item) => item.id === enrollmentId);
  if (!enrollment) throw notFound("Không tìm thấy ghi danh.");
  Object.assign(enrollment, allowed, { updatedAt: new Date().toISOString() });
  return clone(enrollment);
}

export async function updateLessonProgress(userId, enrollmentId, { lessonKey, completed }) {
  if (!lessonKey) throw badRequest("Thiếu lessonKey.");

  if (isMongoReady()) {
    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId });
    if (!enrollment) throw notFound("Không tìm thấy ghi danh.");
    enrollment.progress.set(lessonKey, makeProgressEntry(completed));
    await enrollment.save();
    return enrollment.toJSON();
  }

  const enrollment = memory.enrollments.find((item) => item.id === enrollmentId && item.userId === userId);
  if (!enrollment) throw notFound("Không tìm thấy ghi danh.");
  enrollment.progress[lessonKey] = {
    completed: Boolean(completed),
    completedAt: completed ? new Date().toISOString() : null,
  };
  return clone(enrollment);
}

export async function getEnrollmentForPayment(enrollmentId, userId) {
  if (!enrollmentId) throw badRequest("Thiếu enrollmentId.");

  if (isMongoReady()) {
    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId });
    if (!enrollment) throw notFound("Không tìm thấy ghi danh.");
    return enrollment;
  }

  const enrollment = memory.enrollments.find((item) => item.id === enrollmentId && item.userId === userId);
  if (!enrollment) throw notFound("Không tìm thấy ghi danh.");
  return enrollment;
}

export async function activateEnrollment(enrollment) {
  if (isMongoReady()) {
    enrollment.status = "active";
    await enrollment.save();
    return enrollment.toJSON();
  }

  enrollment.status = "active";
  enrollment.updatedAt = new Date().toISOString();
  return clone(enrollment);
}
