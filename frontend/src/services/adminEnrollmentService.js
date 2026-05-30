import { apiRequest } from "../lib/api";

export async function fetchAdminEnrollments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/enrollments/admin?${query}`);
  return res?.data || { results: [] };
}

export async function updateEnrollmentStatus(enrollmentId, payload) {
  const res = await apiRequest(`/enrollments/${enrollmentId}/admin`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res?.data;
}
