import { Server, Socket } from "socket.io";
import { registerEventMap } from "./dispatcher.js";
import { petEvents } from "@features/pets/sockets/pets.events.js";
export default function registerSockets(io: Server, socket: Socket) {
    registerEventMap(io, socket, petEvents)
}