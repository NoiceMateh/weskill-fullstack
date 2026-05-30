import { ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLearningCourse, listMyLearning, updateLearningProgress } from "../services/learningService.js";

export const mine = asyncHandler(async (req, res) => {
  const courses = await listMyLearning(req.user.id || req.user._id);
  return ok(res, courses);
});

export const showCourse = asyncHandler(async (req, res) => {
  const payload = await getLearningCourse(req.user.id || req.user._id, req.params.courseId);
  return ok(res, payload);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const payload = await updateLearningProgress(
    req.user.id || req.user._id,
    req.params.enrollmentId,
    req.params.lessonKey,
    req.body.completed
  );
  return ok(res, payload);
});
