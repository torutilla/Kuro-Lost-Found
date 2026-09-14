import { Router } from "express";
import LoginController from "../controllers/login.controller.js";
import { validateMiddleware } from "@middleware/index.js";
import { LoginSchema } from "../index.js";
const router = Router();

router.post("/", validateMiddleware(LoginSchema, "body"), LoginController);

export default router;