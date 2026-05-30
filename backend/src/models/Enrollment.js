import mongoose from "mongoose";

const progressEntrySchema = new mongoose.Schema(
  {
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    cohortId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending_payment", "active", "completed", "cancelled"],
      default: "active",
    },
    paymentModel: { type: String, enum: ["upfront", "payLater", "installment"], default: "upfront" },
    formatType: { type: String, enum: ["online", "zoom", "offline", "hybrid"], default: "online" },
    finalPrice: { type: Number, required: true },
    monthlyPrice: { type: Number, default: null },
    progress: { type: Map, of: progressEntrySchema, default: {} },
    startDate: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
