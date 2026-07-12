import { Server, Socket } from "socket.io";

export function registerEventMap(
    io: Server,
    socket: Socket,
    events: Record<string, Function>
) {
    Object.entries(events).forEach(([event, handler]) => {
        socket.on(event, (data) => handler(io, socket, data));
    });
}