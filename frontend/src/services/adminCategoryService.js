import { apiRequest } from "../lib/api";

export async function listCategories(params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await apiRequest(`/categories?${q}`);
  return res?.data?.results || [];
}
