import type { UserPayload } from "./userPayload.type.js";

/**
 * Socket.IO connections carry an authenticated user once the handshake
 * middleware has verified the session cookie. Augmenting the Socket.IO Socket
 * interface keeps `socket.user` typed everywhere, mirroring how
 * `express.d.ts` augments `Express.Request`.
 */
declare module "socket.io" {
    interface Socket {
        user?: UserPayload;
    }
}

export { };