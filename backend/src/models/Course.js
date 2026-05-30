import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { _id: false }
);

const formatSchema = new mongoose.Schema(
  {
    formatType: { type: String, enum: ["online", "zoom", "offline", "hybrid"], required: true },
    priceOverride: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    location: { type: String, default: "" },
    sessionCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    level: { type: String, enum: ["beginner", "intermediate", "advanced", "expert"], default: "beginner" },
    durationWeeks: { type: Number, default: 8 },
    basePrice: { type: Number, required: true },
    requiredSkills: { type: [skillSchema], default: [] },
    formats: { type: [formatSchema], default: [] },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Course = mongoose.model("Course", courseSchema);
