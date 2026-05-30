import { isMongoReady } from "../config/db.js";
import { SiteContent } from "../models/SiteContent.js";
import { memory, clone } from "../data/memoryStore.js";

export async function getSiteContent() {
  if (isMongoReady()) {
    let doc = await SiteContent.findOne({ key: "default" });
    if (!doc) doc = await SiteContent.create({ key: "default" });
    return doc.toJSON();
  }
  return clone(memory.siteContent);
}

export async function updateSiteContent(payload) {
  const allowed = {
    heroTitle: payload.heroTitle,
    heroSubtitle: payload.heroSubtitle,
    heroImageUrl: payload.heroImageUrl,
    consultationYoutubeUrl: payload.consultationYoutubeUrl,
    faqs: Array.isArray(payload.faqs) ? payload.faqs : undefined,
    chatbotSuggestions: Array.isArray(payload.chatbotSuggestions) ? payload.chatbotSuggestions : undefined,
  };
  Object.keys(allowed).forEach((key) => allowed[key] === undefined && delete allowed[key]);

  if (isMongoReady()) {
    const doc = await SiteContent.findOneAndUpdate({ key: "default" }, allowed, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    return doc.toJSON();
  }

  memory.siteContent = { ...memory.siteContent, ...clone(allowed) };
  return clone(memory.siteContent);
}
