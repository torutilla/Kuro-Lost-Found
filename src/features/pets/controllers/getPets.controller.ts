import PetService from "../services/pets.service.js";
import type { GetPetsQuery, GetPetParams } from "../index.js";
import { createHandler } from "@shared/utils/request.util.js";
import { AppError, sendSuccess } from "@shared/index.js";

export const getPetsController = createHandler<{}, {}, GetPetsQuery>(async (req, res) => {
    const { status, lastObservedAt, lastId } = req.query;
    const result = await PetService.getPets(
        {
            status: status,
            lastObservedAt: lastObservedAt,
            lastId: lastId
        }
    );
    sendSuccess(res, {
        message: "Pets fetched successfully",
        data: result,
    });
});

export const getPetByIdController = createHandler<GetPetParams>(async (req, res) => {
    const { id } = req.params;
    if (!req.user?.userId) throw new AppError("Unauthorized", 401);
    const pet = await PetService.findPet(id, req.user.userId);
    sendSuccess(res, {
        message: "Pet fetched successfully",
        data: pet,
    });
});

export const getMyPetsController = createHandler(async (req, res) => {
    if (!req.user?.userId) throw new AppError("Unauthorized", 401);
    const pets = await PetService.getPetsOfUser(req.user.userId);
    sendSuccess(res, { message: "Your pets fetched successfully", data: pets });
});
