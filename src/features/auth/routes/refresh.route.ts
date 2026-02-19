import { Router } from "express";
import refreshController from "../controllers/refresh.controller.js";
const router = Router();
router.post("/", refreshController);

export default router;