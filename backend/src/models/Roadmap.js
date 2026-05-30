import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    resources: {
      type: [
        {
          title: { type: String, default: "" },
          type: { type: String, default: "Link" },
          url: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lessons: { type: [lessonSchema], default: [] },
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", unique: true, required: true },
    modules: { type: [moduleSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);
