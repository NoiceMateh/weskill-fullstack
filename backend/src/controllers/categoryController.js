import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listCategories } from "../services/categoryService.js";

export const index = asyncHandler(async (req, res) => {
  const data = await listCategories(req.query);
  return ok(res, data);
});
