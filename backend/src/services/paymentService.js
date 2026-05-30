import QRCode from "qrcode";
import { isMongoReady } from "../config/db.js";
import { Payment } from "../models/Payment.js";
import { memory, makeId, clone } from "../data/memoryStore.js";
import { badRequest, notFound } from "../utils/httpError.js";
import { getPagination, paginateArray } from "../utils/pagination.js";
import { activateEnrollment, getEnrollmentForPayment } from "./enrollmentService.js";

const toJSON = (doc) => (doc?.toJSON ? doc.toJSON() : clone(doc));

async function persistPayment(payload) {
  if (isMongoReady()) {
    const payment = await Payment.create(payload);
    return payment.toJSON();
  }

  const payment = {
    id: makeId("payment"),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memory.payments.push(payment);
  return clone(payment);
}

export async function listPayments(query = {}) {
  const search = String(query.search || "").trim().toLowerCase();
  const filterStatus = query.status;

  if (isMongoReady()) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    if (filterStatus) filter.status = filterStatus;
    if (search) {
      filter.providerRef = { $regex: search, $options: "i" };
    }

    const [results, totalResults] = await Promise.all([
      Payment.find(filter).populate({ path: "enrollmentId", populate: ["courseId", "userId"] }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(filter),
    ]);
    return { results: results.map((item) => item.toJSON()), page, limit, totalResults, totalPages: Math.ceil(totalResults / limit) || 1 };
  }

  let items = memory.payments.map((item) => clone(item));
  if (filterStatus) items = items.filter((item) => item.status === filterStatus);
  if (search) {
    items = items.filter((item) => `${item.providerRef}`.toLowerCase().includes(search));
  }
  return paginateArray(items, query);
}

export async function updatePaymentStatus(paymentId, payload) {
  const allowed = {};
  if (payload.status) {
    const validStatuses = ["pending", "paid", "failed", "refunded"];
    if (!validStatuses.includes(payload.status)) {
      throw badRequest("Trạng thái thanh toán không hợp lệ.");
    }
    allowed.status = payload.status;
  }
  if (!Object.keys(allowed).length) {
    throw badRequest("Không có dữ liệu cập nhật hợp lệ.");
  }

  if (isMongoReady()) {
    const payment = await Payment.findById(paymentId).populate({ path: "enrollmentId", populate: ["courseId", "userId"] });
    if (!payment) throw notFound("Không tìm thấy payment.");
    const originalStatus = payment.status;
    Object.assign(payment, allowed);
    await payment.save();
    if (originalStatus !== "paid" && allowed.status === "paid" && payment.enrollmentId) {
      await activateEnrollment(payment.enrollmentId);
    }
    return payment.toJSON();
  }

  const payment = memory.payments.find((item) => item.id === paymentId);
  if (!payment) throw notFound("Không tìm thấy payment.");
  const originalStatus = payment.status;
  Object.assign(payment, allowed, { updatedAt: new Date().toISOString() });
  if (originalStatus !== "paid" && allowed.status === "paid") {
    const enrollment = memory.enrollments.find((item) => item.id === payment.enrollmentId);
    if (enrollment) {
      enrollment.status = "active";
      enrollment.updatedAt = new Date().toISOString();
    }
  }
  return clone(payment);
}

export async function createPayment(payload, userId) {
  if (!payload.enrollmentId || !payload.method) {
    throw badRequest("Thiếu enrollmentId hoặc phương thức thanh toán.");
  }

  const enrollment = await getEnrollmentForPayment(payload.enrollmentId, userId);
  const amount = Number(enrollment.finalPrice || payload.amount || 0);
  if (!amount) throw badRequest("Không xác định được số tiền thanh toán.");

  const method = payload.method;
  const isCard = method === "card";
  const payment = await persistPayment({
    enrollmentId: payload.enrollmentId,
    method,
    amount,
    status: isCard ? "paid" : payload.status || "pending",
    dueDate: payload.dueDate || null,
    providerRef: payload.providerRef || makeId(method),
    cardLast4: isCard ? String(payload.cardLast4 || "").slice(-4) : "",
    cardBrand: isCard ? payload.cardBrand || "Card" : "",
  });

  const updatedEnrollment = isCard ? await activateEnrollment(enrollment) : toJSON(enrollment);
  return { payment, enrollment: updatedEnrollment };
}

export async function createVnpayPayment(payload, userId) {
  const result = await createPayment({ ...payload, method: "vnpay", status: "pending" }, userId);
  return {
    ...result,
    paymentUrl: `https://sandbox.vnpayment.vn/mock/${result.payment.id}`,
  };
}

export async function setupPaymentQR(payload, userId) {
  if (!payload.enrollmentId) {
    throw badRequest("Thiếu enrollmentId.");
  }

  const enrollment = await getEnrollmentForPayment(payload.enrollmentId, userId);
  const amount = Number(enrollment.finalPrice || 0);
  if (!amount) throw badRequest("Không xác định được số tiền thanh toán.");

  const paymentRef = makeId("qr");
  const qrData = JSON.stringify({
    enrollmentId: payload.enrollmentId,
    amount,
    ref: paymentRef,
    timestamp: Date.now(),
  });

  const qrCode = await QRCode.toDataURL(qrData);
  const payment = await persistPayment({
    enrollmentId: payload.enrollmentId,
    method: "qr",
    amount,
    status: "pending",
    dueDate: payload.dueDate || null,
    providerRef: paymentRef,
    cardLast4: "",
    cardBrand: "",
  });

  return {
    payment,
    enrollment: toJSON(enrollment),
    qrCode,
    paymentRef,
    message: "Mã QR đã được tạo. Học viên quét mã để thanh toán.",
  };
}
