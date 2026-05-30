import { created, ok } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createCourse, createCourseReview, getCourse, listCourseReviews, listCourses, updateCourse } from "../services/courseService.js";

export const index = asyncHandler(async (req, res) => {
  const data = await listCourses(req.query);
  return ok(res, data);
});

export const adminIndex = asyncHandler(async (req, res) => {
  const data = await listCourses(req.query, { admin: true });
  return ok(res, data);
});

export const show = asyncHandler(async (req, res) => {
  const course = await getCourse(req.params.courseId);
  return ok(res, course);
});

export const create = asyncHandler(async (req, res) => {
  const course = await createCourse(req.body);
  return created(res, course);
});

export const update = asyncHandler(async (req, res) => {
  const course = await updateCourse(req.params.courseId, req.body);
  return ok(res, course);
});

export const reviews = asyncHandler(async (req, res) => {
  const data = await listCourseReviews(req.params.courseId, req.query);
  return ok(res, data);
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await createCourseReview(req.params.courseId, req.body, req.user);
  return created(res, review);
});
