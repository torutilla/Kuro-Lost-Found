import { Router } from "express";
import { logoutController } from "../controllers/logout.controller.js";

const router = Router();

router.post('/', logoutController)

export default router;