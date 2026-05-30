import { created, ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createEnrollment, listMyEnrollments, listEnrollments, updateEnrollmentStatus, updateLessonProgress } from "../services/enrollmentService.js";

export const mine = asyncHandler(async (req, res) => {
  const enrollments = await listMyEnrollments(req.user.id || req.user._id);
  return ok(res, enrollments);
});

export const adminIndex = asyncHandler(async (req, res) => {
  const data = await listEnrollments(req.query);
  return ok(res, data);
});

export const create = asyncHandler(async (req, res) => {
  const enrollment = await createEnrollment(req.user.id || req.user._id, req.body);
  return created(res, enrollment);
});

export const update = asyncHandler(async (req, res) => {
  const enrollment = await updateEnrollmentStatus(req.params.enrollmentId, req.body);
  return ok(res, enrollment);
});

export const progress = asyncHandler(async (req, res) => {
  const enrollment = await updateLessonProgress(req.user.id || req.user._id, req.params.enrollmentId, req.body);
  return ok(res, enrollment);
});
