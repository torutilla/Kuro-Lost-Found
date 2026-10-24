import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "../config/env.js";
import registerSockets from "./registerSockets.js";
import { setIO } from "./socketStore.js";
import { authenticateSocket } from "./auth.middleware.js";

export default function initSocket(server: HTTPServer) {
    const io = new IOServer(server, {
        cors: { origin: `${env.CLIENT_URL}`, credentials: true },
    });

    setIO(io);

    // Authenticate the handshake before any event is accepted.
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id, "user:", socket.user?.userId);
        registerSockets(io, socket);
    });

    return io;
}