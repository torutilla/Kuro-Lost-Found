import { Router } from "express";
import { SignupController } from "../controllers/signup.controller.js";
import { SignupSchema } from "../index.js";
import { validateMiddleware } from "@shared/middleware/validate.middleware.js";


const router = Router();

router.post('/', validateMiddleware(SignupSchema, "body"), SignupController)

export default router;