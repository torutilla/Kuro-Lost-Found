import { Router } from "express";
import authMiddleware from "@shared/middleware/auth.middleware.js";
import homeController from "../controllers/home.controller.js";

const router = Router();

router.get("/", authMiddleware, homeController);

export default router;