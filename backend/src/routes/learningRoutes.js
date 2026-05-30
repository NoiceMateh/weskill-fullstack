import { Router } from "express";
import { mine, showCourse, updateProgress } from "../controllers/learningController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const learningRoutes = Router();

learningRoutes.use(authenticate);
learningRoutes.get("/me", mine);
learningRoutes.get("/courses/:courseId", showCourse);
learningRoutes.patch("/enrollments/:enrollmentId/lessons/:lessonKey/progress", updateProgress);
