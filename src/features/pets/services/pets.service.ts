import { AppError } from "@shared/index.js";
import PetRepository from "../repository/pets.repository.js";
import { PetArraySchema, PetResponseSchema } from "../index.js";
import type { GetPetsOptions, PetInsert, PetStatus } from "../index.js";
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

    static async findPet(id: string, viewerId: string) {
        const pet = await PetRepository.findPetById(id);
        if (!pet) throw new AppError(`Cannot find pet with id: ${id}`, 404);
        if (!['lost', 'found'].includes(pet.status) && pet.user_id !== viewerId) {
            throw new AppError(`Cannot find pet with id: ${id}`, 404);
        }

        return PetResponseSchema.parse(pet);
    }

    static async getPetsOfUser(userId: string) {
        return PetArraySchema.shape.pets.parse(await PetRepository.getPetsOfUser(userId));
    }

    static async updateStatus(id: string, userId: string, status: PetStatus) {
        try {
            const pet = await PetRepository.updateStatus(id, userId, status);
            if (!pet) throw new AppError("Pet not found or not owned by user", 404);
            const parsed = PetResponseSchema.parse(pet);
            getIO().emit("pet:updated", parsed);
            return parsed;
        } catch (error: any) {
            if (error?.code === "23514") {
                throw new AppError(error.message, 400);
            }
            throw error;
        }
    }
}
