import { Router } from "express";
import LoginController from "../controllers/loginController.ts";
const router = Router();

router.post("/", LoginController);

export default router;