import { AppError } from "@shared/index.js";
import PetModel from "../models/pets.model.js";
import { GetPetsOptions, PetRequest } from "../index.js";

export default class PetService {
    static async getPets(options: GetPetsOptions) {
        const pets = await PetModel.getPets(options);
        return pets;
    }

    static async addPet(pet: PetRequest) {
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