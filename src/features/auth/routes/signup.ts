import { Router } from "express";
import { SignupController } from "../controllers/signup.controller.js";


const router = Router();

router.post('/', SignupController)

export default router;