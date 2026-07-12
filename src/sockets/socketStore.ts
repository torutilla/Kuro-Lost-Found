import type { Server as IOServer } from "socket.io";

let io: IOServer | null = null;

export const setIO = (newIO: IOServer) => {
    io = newIO;
};

export const getIO = (): IOServer => {
    if (!io) throw new Error("Socket.IO not initialized");
    return io;
};