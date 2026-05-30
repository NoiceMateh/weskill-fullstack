import { Router } from "express";
import { adminIndex, create, createReview, index, reviews, show, update } from "../controllers/courseController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const courseRoutes = Router();

courseRoutes.get("/", index);
courseRoutes.get("/admin", authenticate, authorize("admin", "instructor"), adminIndex);
courseRoutes.post("/", authenticate, authorize("admin"), create);
courseRoutes.patch("/:courseId", authenticate, authorize("admin"), update);
courseRoutes.get("/:courseId", show);
courseRoutes.get("/:courseId/reviews", reviews);
courseRoutes.post("/:courseId/reviews", authenticate, createReview);
