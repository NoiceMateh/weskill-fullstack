import bcrypt from "bcryptjs";
import { defaultRoadmapModules, seedCategories, seedCourses, seedSiteContent, seedUsers } from "./seedData.js";

const clone = (value) => JSON.parse(JSON.stringify(value));

export const memory = {
  ready: false,
  users: [],
  categories: [],
  courses: [],
  roadmaps: [],
  enrollments: [],
  payments: [],
  reviews: [],
  siteContent: clone(seedSiteContent),
};

export async function initMemoryStore() {
  if (memory.ready) return;

  memory.categories = clone(seedCategories);
  memory.courses = clone(seedCourses).map((course) => ({
    ...course,
    categoryId: memory.categories.find((category) => category.id === course.categoryId),
  }));

  memory.users = await Promise.all(
    seedUsers.map(async ({ password, ...user }) => ({
      ...user,
      passwordHash: await bcrypt.hash(password, 10),
      refreshTokenHash: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  );

  memory.roadmaps = memory.courses.map((course) => ({
    id: `roadmap-${course.id}`,
    courseId: course.id,
    modules: clone(defaultRoadmapModules),
  }));

  memory.enrollments = [
    {
      id: "enrollment-student-fullstack",
      userId: "u-student",
      courseId: "course-fullstack",
      cohortId: "course-fullstack",
      paymentModel: "upfront",
      formatType: "online",
      status: "active",
      finalPrice: 14900000,
      monthlyPrice: null,
      progress: {},
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  memory.reviews = [
    {
      id: "review-1",
      courseId: "course-fullstack",
      userId: "u-student",
      authorName: "Trần Minh",
      rating: 5,
      comment: "Nội dung thực chiến, mentor hỗ trợ kỹ và bài tập rõ ràng.",
      createdAt: new Date("2026-01-14T00:00:00.000Z").toISOString(),
    },
  ];

  memory.ready = true;
}

export function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, refreshTokenHash, ...safeUser } = user;
  return clone(safeUser);
}

export { clone };
