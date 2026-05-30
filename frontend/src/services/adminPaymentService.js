import { apiRequest } from "../lib/api";

export async function fetchAdminPayments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await apiRequest(`/payments/admin?${query}`);
  return res?.data || { results: [] };
}

export async function updatePaymentStatus(paymentId, payload) {
  const res = await apiRequest(`/payments/${paymentId}/admin`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res?.data;
}
