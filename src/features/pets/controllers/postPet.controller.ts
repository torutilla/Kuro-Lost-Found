import PetService from "../services/pets.service.js";
import { createHandler } from "@shared/utils/request.util.js";
import { PetRequest } from "../index.js";


export const postPetController = createHandler<{}, PetRequest>(async (req, res) => {
    const pet = req.body;
    const petId = await PetService.addPet(pet);
    res.json({ id: petId });
})
