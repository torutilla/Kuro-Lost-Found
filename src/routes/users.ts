import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.ts";
import getCurrentUserController from "../controllers/currentUser.controller.ts";

const router = Router();

router.get("/me", getCurrentUserController);

export default router;