import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    track: { type: String, enum: ["technology", "creative", "business"], required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Category = mongoose.model("Category", categorySchema);
