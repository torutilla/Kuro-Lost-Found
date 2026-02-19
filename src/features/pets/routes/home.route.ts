import { Router } from "express";
import authMiddleware from "@shared/middleware/auth.middleware.ts";
import homeController from "../controllers/home.controller.ts";

const router = Router();

router.get("/", authMiddleware, homeController);

export default router;