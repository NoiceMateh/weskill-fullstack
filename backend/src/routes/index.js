import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { courseRoutes } from "./courseRoutes.js";
import { enrollmentRoutes } from "./enrollmentRoutes.js";
import { learningRoutes } from "./learningRoutes.js";
import { paymentRoutes } from "./paymentRoutes.js";
import { roadmapRoutes } from "./roadmapRoutes.js";
import { siteContentRoutes } from "./siteContentRoutes.js";
import { categoryRoutes } from "./categoryRoutes.js";
import { userRoutes } from "./userRoutes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (req, res) => res.json({ data: { ok: true, service: "weskill-backend" } }));
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/courses", courseRoutes);
apiRoutes.use("/categories", categoryRoutes);
apiRoutes.use("/enrollments", enrollmentRoutes);
apiRoutes.use("/learning", learningRoutes);
apiRoutes.use("/payments", paymentRoutes);
apiRoutes.use("/roadmaps", roadmapRoutes);
apiRoutes.use("/site-content", siteContentRoutes);
