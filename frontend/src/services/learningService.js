import { apiRequest } from "../lib/api";

export async function getMyLearningCourses() {
  const res = await apiRequest("/learning/me");
  return res?.data || [];
}

export async function getLearningCourse(courseId) {
  const res = await apiRequest(`/learning/courses/${courseId}`);
  return res?.data || null;
}

export async function updateLearningLessonProgress(enrollmentId, lessonKey, completed) {
  const encodedKey = encodeURIComponent(lessonKey);
  const res = await apiRequest(`/learning/enrollments/${enrollmentId}/lessons/${encodedKey}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
  return res?.data || null;
}
