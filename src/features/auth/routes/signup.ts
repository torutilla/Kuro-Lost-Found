import { Router } from "express";
import { SignupController } from "../controllers/signup.controller.ts";


const router = Router();

router.post('/', SignupController)

export default router;