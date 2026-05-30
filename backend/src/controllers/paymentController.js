import { created, ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createPayment, createVnpayPayment, setupPaymentQR, listPayments, updatePaymentStatus } from "../services/paymentService.js";

export const adminIndex = asyncHandler(async (req, res) => {
  const data = await listPayments(req.query);
  return ok(res, data);
});

export const update = asyncHandler(async (req, res) => {
  const payment = await updatePaymentStatus(req.params.paymentId, req.body);
  return ok(res, payment);
});

export const create = asyncHandler(async (req, res) => {
  const payment = await createPayment(req.body, req.user.id || req.user._id);
  return created(res, payment);
});

export const createVnpay = asyncHandler(async (req, res) => {
  const payload = await createVnpayPayment(req.body, req.user.id || req.user._id);
  return created(res, payload);
});

export const setupQR = asyncHandler(async (req, res) => {
  const result = await setupPaymentQR(req.body, req.user.id || req.user._id);
  return created(res, result);
});
