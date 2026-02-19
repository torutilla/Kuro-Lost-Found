import { Router } from "express";
import refreshController from "../controllers/refresh.controller.ts";
const router = Router();
router.post("/", refreshController);

export default router;