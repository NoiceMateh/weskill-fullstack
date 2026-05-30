import { apiRequest } from "../lib/api";

export async function fetchAdminCourses(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/courses/admin?${query}`);
  return res?.data || { results: [] };
}

export async function createCourse(payload) {
  const res = await apiRequest("/courses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res?.data;
}

export async function updateCourse(courseId, payload) {
  const res = await apiRequest(`/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res?.data;
}
