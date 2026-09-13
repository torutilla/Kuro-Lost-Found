import PetService from "../services/pets.service.js";
import { createHandler } from "@shared/utils/request.util.js";
import { AppError, sendSuccess } from "@shared/index.js";
import type { PetStatusUpdate } from "../index.js";

export const updatePetStatusController = createHandler<{ id: string }, PetStatusUpdate>(async (req, res) => {
    if (!req.user?.userId) throw new AppError("Unauthorized", 401);
    const pet = await PetService.updateStatus(req.params.id, req.user.userId, req.body.status);
    sendSuccess(res, { message: "Pet status updated successfully", data: pet });
});
