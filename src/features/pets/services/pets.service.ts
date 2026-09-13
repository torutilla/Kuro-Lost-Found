import { AppError } from "@shared/index.js";
import PetRepository from "../repository/pets.repository.js";
import { PetArraySchema, PetResponseSchema } from "../index.js";
import type { GetPetsOptions, PetInsert } from "../index.js";
import { getIO } from "@sockets/socketStore.js";

export default class PetService {

    static async getPets(options: GetPetsOptions) {
        const pets = await PetRepository.getPets(options);
        return PetArraySchema.parse(pets);
    }

    static async addPet(pet: PetInsert) {
        const petRes = await PetRepository.addPet(pet);
        if (!petRes) throw new Error("Cannot add pet");

        getIO().emit("pet:added", petRes);
        return petRes.id;
    }

    static async findPet(id: string) {
        const pet = await PetRepository.findPetById(id);
        if (!pet) throw new AppError(`Cannot find pet with id: ${id}`, 404);

        return PetResponseSchema.parse(pet);
    }
}