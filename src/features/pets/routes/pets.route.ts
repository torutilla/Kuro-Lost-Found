import { Router } from "express";
import { getPetByIdController, getPetsController } from "../controllers/getPets.controller.js";
import { validateMiddleware, authMiddleware } from "@middleware/index.js";
import { postPetController } from "../controllers/postPet.controller.js";
import { GetPetsQuerySchema, GetPetParamsSchema, PetRequestSchema } from "../index.js";

const router = Router();

router.get("/", authMiddleware, validateMiddleware(GetPetsQuerySchema, "query"), getPetsController);
router.get("/:id", authMiddleware, validateMiddleware(GetPetParamsSchema, "params"), getPetByIdController);
router.post("/create", authMiddleware, validateMiddleware(PetRequestSchema, "body"), postPetController);

export default router;