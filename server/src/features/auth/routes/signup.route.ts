import { Router } from "express";
import { SignupController } from "../controllers/signup.controller.js";
import { SignupSchema } from "../index.js";
import { validateMiddleware } from "@middleware/index.js";


const router: Router = Router();

router.post('/', validateMiddleware(SignupSchema, "body"), SignupController)

export default router;