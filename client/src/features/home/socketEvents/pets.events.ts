import type { Pet } from "../schema/petSchema.ts";

export interface PetServerToClientEvents {
    "pet:created": (pet: Pet) => void;
    "pet:deleted": (data: { id: string }) => void;
}

export interface PetClientToServerEvents {

}