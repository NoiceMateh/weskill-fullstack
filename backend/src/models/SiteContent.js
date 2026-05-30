import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "default" },
    heroTitle: { type: String, default: "Tư vấn & Câu hỏi thường gặp" },
    heroSubtitle: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    consultationYoutubeUrl: { type: String, default: "" },
    faqs: { type: [faqSchema], default: [] },
    chatbotSuggestions: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
