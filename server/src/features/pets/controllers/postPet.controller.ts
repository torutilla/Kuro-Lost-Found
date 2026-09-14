import PetService from "../services/pets.service.js";
import { createHandler } from "@shared/utils/request.util.js";
import type { PetRequest, PetInsert } from "../index.js";
import { AppError, sendSuccess } from "@shared/index.js";


export const postPetController = createHandler<{}, PetRequest>(async (req, res) => {
    if (!req.user?.userId) {
        throw new AppError("Unauthorized", 401);
    }
    const pet: PetInsert = { ...req.body, user_id: req.user.userId };
    const petId = await PetService.addPet(pet);
    sendSuccess(res, {
        message: "Pet created successfully",
        data: { id: petId },
    });
})
