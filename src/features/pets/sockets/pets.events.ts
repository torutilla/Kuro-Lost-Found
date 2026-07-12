import { handlePetCreate } from "./pets.socketHandler.js";
export const petEvents = {
    "pet:added": handlePetCreate,
};