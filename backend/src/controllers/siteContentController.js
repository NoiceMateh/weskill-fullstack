import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSiteContent, updateSiteContent } from "../services/siteContentService.js";

export const show = asyncHandler(async (req, res) => {
  const doc = await getSiteContent();
  return ok(res, doc);
});

export const patch = asyncHandler(async (req, res) => {
  const doc = await updateSiteContent(req.body);
  return ok(res, doc);
});
