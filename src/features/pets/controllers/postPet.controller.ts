import PetService from "../services/pets.service.js";
import { createHandler } from "@shared/utils/request.util.js";
import { Pet } from "../index.js";


export const postPetController = createHandler<{}, Pet>(async (req, res) => {
    const pet = req.body;
    const petId = await PetService.addPet(pet);
    res.json(petId);
})
