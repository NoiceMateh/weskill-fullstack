import { Router } from "express";
import { index, update } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const userRoutes = Router();

userRoutes.use(authenticate, authorize("admin"));
userRoutes.get("/", index);
userRoutes.patch("/:userId", update);
