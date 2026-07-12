import { Router } from "express";
import getCurrentUserController from "../controllers/currentUser.controller.js";
import { authMiddleware } from "@middleware/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getCurrentUserController);

export default router;