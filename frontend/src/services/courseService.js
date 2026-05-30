import { apiRequest } from "../lib/api";
import { adaptCourse } from "../adapters/courseAdapter";

export async function getCourses() {
  const response = await apiRequest("/courses?populate=categoryId,formats&limit=100");
  const rawCourses = response?.data?.results || [];
  return rawCourses.map(adaptCourse);
}

export async function getCourseById(courseId) {
  const response = await apiRequest(`/courses/${courseId}?populate=categoryId,formats`);
  return adaptCourse(response?.data);
}

/** Danh sách thô từ API (cho admin chọn khóa học) */
export async function fetchCoursesRaw(options = {}) {
  const limit = options.limit ?? 200;
  const response = await apiRequest(`/courses/admin?populate=categoryId&limit=${limit}`);
  return response?.data?.results || [];
}
