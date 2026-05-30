import { apiRequest } from "../lib/api";

export async function getRoadmapByCourseId(courseId) {
  const res = await apiRequest(`/roadmaps/course/${courseId}`);
  return res?.data || null;
}

export async function saveRoadmap(courseId, modules) {
  const res = await apiRequest(`/roadmaps/course/${courseId}`, {
    method: "PUT",
    body: JSON.stringify({ modules }),
  });
  return res?.data;
}
