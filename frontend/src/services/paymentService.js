import { apiRequest } from "../lib/api";

export async function createCardPayment(payload) {
  const res = await apiRequest("/payments", {
    method: "POST",
    body: JSON.stringify({ ...payload, method: "card" }),
  });
  return res?.data;
}

export async function setupQrPayment(payload) {
  const res = await apiRequest("/payments/setup-qr", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res?.data;
}
