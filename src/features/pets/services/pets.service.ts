import { AppError } from "@shared/utils/errors.js";
import PetModel from "../models/pets.model.js";
import { Pet, PetFilter } from "../types/pets.type.js";

export default class PetService {
    static async getPets(page: number, filter: PetFilter) {

        const pets = await PetModel.getPets({ status: filter, limit: page * 10 });
        if (!pets) throw new AppError("No pets found.", 404);

        return pets;
    }

    static async addPet(pet: Pet) {

    }
}