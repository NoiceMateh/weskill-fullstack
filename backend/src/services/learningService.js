import { isMongoReady } from "../config/db.js";
import { memory, clone } from "../data/memoryStore.js";
import { Enrollment } from "../models/Enrollment.js";
import { forbidden, notFound } from "../utils/httpError.js";
import { getRoadmapByCourseId } from "./roadmapService.js";
import { updateLessonProgress } from "./enrollmentService.js";

const toId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.id) return String(value.id);
  if (value._id) return String(value._id);
  return String(value);
};

const toProgressObject = (progress) => {
  if (!progress) return {};
  if (progress instanceof Map) return Object.fromEntries(progress.entries());
  if (typeof progress.toObject === "function") return progress.toObject();
  return progress;
};

const normalizeProgressEntry = (entry) => {
  if (typeof entry === "boolean") {
    return { completed: entry, completedAt: null };
  }
  return {
    completed: Boolean(entry?.completed),
    completedAt: entry?.completedAt || null,
  };
};

const formatDuration = (minutes) => {
  const value = Number(minutes) || 0;
  if (!value) return "Chưa cập nhật";
  return `${value} phut`;
};

const normalizeCourse = (course) => {
  const raw = course?.toJSON ? course.toJSON() : course;
  return {
    id: toId(raw),
    title: raw?.title || "",
    name: raw?.title || "",
    description: raw?.description || "",
    thumbnailUrl: raw?.thumbnailUrl || "",
    durationWeeks: raw?.durationWeeks || 0,
    level: raw?.level || "",
    categoryId: raw?.categoryId || null,
  };
};

function buildLearningPayload(enrollment, course, roadmap) {
  const progress = toProgressObject(enrollment.progress);
  let totalLessons = 0;
  let completedLessons = 0;

  const modules = (roadmap.modules || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((module, moduleIndex) => {
      const lessons = (module.lessons || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((lesson, lessonIndex) => {
          totalLessons += 1;
          const key = lesson.key || `module-${moduleIndex}-lesson-${lessonIndex}`;
          const state = normalizeProgressEntry(progress[key]);
          if (state.completed) completedLessons += 1;

          return {
            key,
            title: lesson.title || `Bai ${lessonIndex + 1}`,
            order: lesson.order ?? lessonIndex,
            description: lesson.description || "",
            durationMinutes: Number(lesson.durationMinutes) || 0,
            duration: formatDuration(lesson.durationMinutes),
            imageUrl: lesson.imageUrl || "",
            videoUrl: lesson.videoUrl || "",
            youtubeUrl: lesson.youtubeUrl || "",
            resources: Array.isArray(lesson.resources) ? lesson.resources : [],
            completed: state.completed,
            completedAt: state.completedAt,
          };
        });

      return {
        title: module.title || `Module ${moduleIndex + 1}`,
        order: module.order ?? moduleIndex,
        lessons,
        completed: lessons.length > 0 && lessons.every((lesson) => lesson.completed),
      };
    });

  const progressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    enrollment: {
      id: toId(enrollment),
      status: enrollment.status,
      paymentModel: enrollment.paymentModel,
      formatType: enrollment.formatType,
      startDate: enrollment.startDate,
    },
    course: normalizeCourse(course),
    roadmap: {
      id: toId(roadmap),
      courseId: toId(roadmap.courseId) || toId(course),
      modules,
      totalModules: modules.length,
      totalLessons,
      completedLessons,
      progressPercent,
      estimatedTime: `${modules.reduce(
        (sum, module) => sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.durationMinutes || 0), 0),
        0
      )} phut`,
    },
  };
}

async function findActiveEnrollment(userId, courseId) {
  if (isMongoReady()) {
    return Enrollment.findOne({ userId, courseId, status: "active" }).populate("courseId");
  }

  const enrollment = memory.enrollments.find(
    (item) => item.userId === userId && item.courseId === courseId && item.status === "active"
  );
  if (!enrollment) return null;
  return {
    ...clone(enrollment),
    courseId: memory.courses.find((course) => course.id === enrollment.courseId) || enrollment.courseId,
  };
}

export async function listMyLearning(userId) {
  if (isMongoReady()) {
    const enrollments = await Enrollment.find({ userId, status: "active" }).populate("courseId").sort({ createdAt: -1 });
    const items = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = enrollment.courseId;
        const courseId = toId(course);
        const roadmap = await getRoadmapByCourseId(courseId);
        return buildLearningPayload(enrollment.toJSON(), course, roadmap);
      })
    );
    return items;
  }

  const enrollments = memory.enrollments.filter((item) => item.userId === userId && item.status === "active");
  return Promise.all(
    enrollments.map(async (enrollment) => {
      const course = memory.courses.find((item) => item.id === enrollment.courseId);
      const roadmap = await getRoadmapByCourseId(enrollment.courseId);
      return buildLearningPayload(enrollment, course, roadmap);
    })
  );
}

export async function getLearningCourse(userId, courseId) {
  const enrollment = await findActiveEnrollment(userId, courseId);
  if (!enrollment) throw forbidden("Bạn chưa có quyền truy cập khóa học này.");

  const rawEnrollment = enrollment.toJSON ? enrollment.toJSON() : enrollment;
  const course = rawEnrollment.courseId;
  const roadmap = await getRoadmapByCourseId(courseId);
  return buildLearningPayload(rawEnrollment, course, roadmap);
}

export async function updateLearningProgress(userId, enrollmentId, lessonKey, completed) {
  const updatedEnrollment = await updateLessonProgress(userId, enrollmentId, { lessonKey, completed });
  const courseId = toId(updatedEnrollment.courseId);
  if (!courseId) throw notFound("Không tìm thấy khóa học của ghi danh.");
  return getLearningCourse(userId, courseId);
}
