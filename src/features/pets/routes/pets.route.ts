import { Router } from "express";
import { getPetsController } from "../controllers/getPets.controller.js";
import { validateMiddleware, authMiddleware } from "@shared/middleware/index.js";
import { postPetController } from "../controllers/postPet.controller.js";
import { GetPetsQuerySchema, PetParamsSchema } from "../index.js";

const router = Router();

router.get("/", authMiddleware, validateMiddleware(GetPetsQuerySchema, "query"), getPetsController);
router.get("/:id", authMiddleware, validateMiddleware(PetParamsSchema, "params"));
router.post("/create", authMiddleware, postPetController);
export default router;