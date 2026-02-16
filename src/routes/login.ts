import { Router } from "express";
import LoginController from "../controllers/login.controller.ts";
const router = Router();

router.post("/", LoginController);

export default router;