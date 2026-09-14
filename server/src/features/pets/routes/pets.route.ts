import { Router } from "express";
import { getMyPetsController, getPetByIdController, getPetsController } from "../controllers/getPets.controller.js";
import { validateMiddleware, authMiddleware } from "@middleware/index.js";
import { postPetController } from "../controllers/postPet.controller.js";
import { GetPetsQuerySchema, GetPetParamsSchema, PetRequestSchema, PetStatusUpdateSchema } from "../index.js";
import { updatePetStatusController } from "../controllers/updatePetStatus.controller.js";

const router = Router();

router.get("/", authMiddleware, validateMiddleware(GetPetsQuerySchema, "query"), getPetsController);
router.get("/mine", authMiddleware, getMyPetsController);
router.patch("/:id/status", authMiddleware, validateMiddleware(GetPetParamsSchema, "params"), validateMiddleware(PetStatusUpdateSchema, "body"), updatePetStatusController);
router.get("/:id", authMiddleware, validateMiddleware(GetPetParamsSchema, "params"), getPetByIdController);
router.post("/create", authMiddleware, validateMiddleware(PetRequestSchema, "body"), postPetController);

export default router;
