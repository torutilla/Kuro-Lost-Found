import { Router } from "express";
import { SignupController } from "../controllers/signupController.ts";


const router = Router();

router.post('/', SignupController)

export default router;