import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    authorName: { type: String, default: "Học viên" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Review = mongoose.model("Review", reviewSchema);
