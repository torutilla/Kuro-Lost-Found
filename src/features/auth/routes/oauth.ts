import { Router } from "express";
import { googleCallbackController, googleController } from "../controllers/google.controller.ts";

const router = Router();

router.get("/google", googleController);
router.get("/google/callback", googleCallbackController);

export default router;