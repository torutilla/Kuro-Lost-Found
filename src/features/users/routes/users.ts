import { Router } from "express";
import getCurrentUserController from "../controllers/currentUser.controller.ts";

const router = Router();

router.get("/me", getCurrentUserController);

export default router;