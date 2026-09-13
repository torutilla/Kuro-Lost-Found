import type { PetRequest, Pet, GetPetsQuery } from "../schema/pets.schema.js";

export type PetInsert = PetRequest & { user_id: string };
export type PetStatus = Pet["status"];
export type VisiblePetStatus = Extract<PetStatus, "lost" | "found">;
export type GetPetsOptions = GetPetsQuery & { limit?: number };
