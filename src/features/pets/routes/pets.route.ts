import { Router } from "express";
import { getPetByIdController, getPetsController } from "../controllers/getPets.controller.js";
import { validateMiddleware, authMiddleware } from "@shared/middleware/index.js";
import { postPetController } from "../controllers/postPet.controller.js";
import { GetPetsQuerySchema, GetPetParamsSchema, PostPetSchema } from "../index.js";

const router = Router();

router.get("/", authMiddleware, validateMiddleware(GetPetsQuerySchema, "query"), getPetsController);
router.get("/:id", authMiddleware, validateMiddleware(GetPetParamsSchema, "params"), getPetByIdController);
router.post("/create", authMiddleware, validateMiddleware(PostPetSchema, "body"), postPetController);

export default router;