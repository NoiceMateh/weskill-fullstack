import { apiRequest } from "../lib/api";

export async function listUsers(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await apiRequest(`/users?${q}`);
  return res?.data;
}

export async function updateUserRole(userId, body) {
  const res = await apiRequest(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return res?.data;
}
