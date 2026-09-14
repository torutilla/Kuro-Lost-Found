import { Server, Socket } from "socket.io";
import PetService from "../services/pets.service.js";

export async function handlePetCreate(io: Server, socket: Socket, data: any) {
    // TODO: derive `user_id` from the authenticated socket once socket auth
    // (handshake/socket middleware) is wired up. Until then the client
    // supplies user_id alongside the pet data.
    await PetService.addPet(data);
}