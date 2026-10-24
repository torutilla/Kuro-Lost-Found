import { Server, Socket } from "socket.io";
import PetService from "../services/pets.service.js";
import { PetRequestSchema } from "../schema/pets.schema.js";

type PetCreateAck = {
    success?: boolean;
    id?: string;
    message?: string;
};

/**
 * Create a pet report over the socket.
 * - Identity comes from the authenticated socket handshake, never from a
 *   client-supplied `user_id`.
 * - The payload is validated with the same schema used by the HTTP API.
 * - A clear acknowledgement (success or error) is always returned.
 */
export async function handlePetCreate(
    io: Server,
    socket: Socket,
    data: unknown,
    ack?: (res: PetCreateAck) => void
) {
    const userId = socket.user?.userId;
    if (!userId) {
        return ack?.({ message: "Authentication required" });
    }

    const res = PetRequestSchema.safeParse(data);
    if (!res.success) {
        return ack?.({ message: "Invalid report data" });
    }

    try {
        const petId = await PetService.addPet({ ...res.data, user_id: userId });
        return ack?.({ success: true, id: petId });
    } catch (error: any) {
        return ack?.({ message: error.message ?? "Failed to create report" });
    }
}