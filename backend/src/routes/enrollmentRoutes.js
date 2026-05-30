import { Router } from "express";
import { adminIndex, create, mine, progress, update } from "../controllers/enrollmentController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const enrollmentRoutes = Router();

enrollmentRoutes.use(authenticate);
enrollmentRoutes.get("/me", mine);
enrollmentRoutes.get("/admin", authorize("admin"), adminIndex);
enrollmentRoutes.post("/", create);
enrollmentRoutes.patch("/:enrollmentId/progress", progress);
enrollmentRoutes.patch("/:enrollmentId/admin", authorize("admin"), update);
