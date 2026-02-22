import { AppError } from "@shared/utils/errors.js";
import PetModel from "../models/pets.model.js";
import { GetPetsOptions, Pet, PetFilter } from "../types/pets.type.js";

export default class PetService {
    static async getPets(options: GetPetsOptions) {
        const pets = await PetModel.getPets(options);
        return pets;
    }

    static async addPet(pet: Pet) {
        const petId = await PetModel.addPet(pet);
        if (!petId) throw new Error("Cannot add pet");

        return petId;
    }

    static async findPet(id: string) {
        const pet = await PetModel.findPetById(id);
        if (!pet) throw new AppError(`Cannot find pet with id: ${id}`, 404);

        return pet;
    }
}