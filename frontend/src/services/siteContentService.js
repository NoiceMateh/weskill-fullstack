import { apiRequest } from "../lib/api";

export async function getSiteContent() {
  const res = await apiRequest("/site-content");
  return res?.data;
}

export async function updateSiteContent(payload) {
  const res = await apiRequest("/site-content", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res?.data;
}
