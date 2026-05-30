import { Router } from "express";
import { index } from "../controllers/categoryController.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", index);
