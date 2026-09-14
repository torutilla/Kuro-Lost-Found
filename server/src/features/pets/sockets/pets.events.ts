import { handlePetCreate } from "./pets.socketHandler.js";
export const petEvents = {
    "pet:create": handlePetCreate,
};