import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "../shared/index.js";
import registerSockets from "./registerSockets.js";
import { setIO } from "./socketStore.js";
export default function initSocket(server: HTTPServer) {
    const io = new IOServer(server, {
        cors: { origin: `${env.CLIENT_URL}`, credentials: true },
    });

    setIO(io);

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        registerSockets(io, socket);
    });

    return io;
}