import { Router } from "express";
import { patch, show } from "../controllers/siteContentController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

export const siteContentRoutes = Router();

siteContentRoutes.get("/", show);
siteContentRoutes.patch("/", authenticate, authorize("admin"), patch);
