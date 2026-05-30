import { Router } from "express";
import { adminIndex, create, createVnpay, setupQR, update } from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const paymentRoutes = Router();

paymentRoutes.use(authenticate);
paymentRoutes.get("/admin", authorize("admin"), adminIndex);
paymentRoutes.post("/", create);
paymentRoutes.post("/vnpay", createVnpay);
paymentRoutes.post("/setup-qr", setupQR);
paymentRoutes.patch("/:paymentId/admin", authorize("admin"), update);
