import PetService from "../services/pets.service.js";
import { GetPetsQuery, PetParams } from "../index.js";
import { createHandler } from "@shared/utils/request.util.js";

export const getPetsController = createHandler<{}, {}, GetPetsQuery>(async (req, res) => {
    const { status, lastDateLost, lastId } = req.query;
    const result = await PetService.getPets(
        {
            status: status,
            lastDateLost: lastDateLost,
            lastId: lastId
        }
    );
    res.json(result);
});

export const getPetByIdController = createHandler<PetParams>(async (req, res) => {
    const { id } = req.params;
    const pet = await PetService.findPet(id);
    res.json(pet);
});
