import { apiRequest } from "../lib/api";

export async function getMyEnrollments() {
  const res = await apiRequest("/enrollments/me");
  return res?.data || [];
}

export async function createEnrollment(payload) {
  const res = await apiRequest("/enrollments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res?.data;
}

export async function updateLessonProgress(enrollmentId, lessonKey, completed) {
  const res = await apiRequest(`/enrollments/${enrollmentId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ lessonKey, completed }),
  });
  return res?.data;
}

export async function enrollInCohort(cohortId) {
  return createEnrollment({ cohortId });
}
