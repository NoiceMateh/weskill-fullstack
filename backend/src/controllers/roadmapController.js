import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRoadmapByCourseId, saveRoadmap } from "../services/roadmapService.js";

export const showByCourse = asyncHandler(async (req, res) => {
  const roadmap = await getRoadmapByCourseId(req.params.courseId);
  return ok(res, roadmap);
});

export const upsertByCourse = asyncHandler(async (req, res) => {
  const roadmap = await saveRoadmap(req.params.courseId, req.body.modules);
  return ok(res, roadmap);
});
