import { Router } from "express";
import authMiddleware from "@shared/middleware/auth.middleware.js";
import getPetsController from "../controllers/pets.controller.js";
import { validateMiddleware } from "../../../shared/middleware/validate.middleware.js";
import { GetPetsQuerySchema, PetParamsSchema } from "../schema/pets.schema.js";

const router = Router();

router.get("/", authMiddleware, validateMiddleware(GetPetsQuerySchema, "query"), getPetsController);
router.post("/:id", authMiddleware, validateMiddleware(PetParamsSchema, "params"));
export default router;