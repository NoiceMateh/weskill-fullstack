import { Router } from "express";
import { login, logout, me, refresh, register } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/refresh", refresh);
authRoutes.get("/me", authenticate, me);
authRoutes.post("/logout", authenticate, logout);
