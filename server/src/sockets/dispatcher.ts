import { Server, Socket } from "socket.io";

export function registerEventMap(
    io: Server,
    socket: Socket,
    events: Record<string, Function>
) {
    Object.entries(events).forEach(([event, handler]) => {
        socket.on(event, (...args: unknown[]) => {
            // Socket.IO v4 passes an acknowledgement callback as the last
            // argument when the client expects one. Forward it so handlers can
            // reply with clear success/error responses instead of leaving the
            // client hanging.
            const ack =
                typeof args[args.length - 1] === "function"
                    ? (args.pop() as (res: unknown) => void)
                    : undefined;
            (handler as (
                io: Server,
                socket: Socket,
                data: unknown,
                ack?: (res: unknown) => void
            ) => void)(io, socket, args[0], ack);
        });
    });
}