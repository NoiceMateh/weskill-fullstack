import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    method: { type: String, enum: ["vnpay", "deferred", "bank_transfer", "qr", "card", "wallet"], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    dueDate: { type: Date, default: null },
    providerRef: { type: String, default: "" },
    cardLast4: { type: String, default: "" },
    cardBrand: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Payment = mongoose.model("Payment", paymentSchema);
