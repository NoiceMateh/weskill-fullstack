import { Router } from "express";
import { showByCourse, upsertByCourse } from "../controllers/roadmapController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const roadmapRoutes = Router();

roadmapRoutes.get("/course/:courseId", authenticate, showByCourse);
roadmapRoutes.put("/course/:courseId", authenticate, authorize("admin", "instructor"), upsertByCourse);
