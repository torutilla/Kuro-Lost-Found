import PetService from "../services/pets.service.js";
import type { GetPetsQuery, GetPetParams } from "../index.js";
import { createHandler } from "@shared/utils/request.util.js";
import { sendSuccess } from "@shared/index.js";

export const getPetsController = createHandler<{}, {}, GetPetsQuery>(async (req, res) => {
    const { status, lastDateLost, lastId } = req.query;
    const result = await PetService.getPets(
        {
            status: status,
            lastDateLost: lastDateLost,
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
    const pet = await PetService.findPet(id);
    sendSuccess(res, {
        message: "Pet fetched successfully",
        data: pet,
    });
});
