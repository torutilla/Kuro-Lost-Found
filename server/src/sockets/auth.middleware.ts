import { Socket } from "socket.io";
import TokenService from "@features/auth/services/token.service.js";

/**
 * Parse a single cookie value out of a Cookie header without pulling in the
 * transitive `cookie` package.
 */
function getCookie(cookieHeader: string | undefined, name: string): string | undefined {
    if (!cookieHeader) return undefined;
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? match[1] : undefined;
}

/**
 * Socket.IO handshake middleware.
 * Authenticates every connection using the `access_token` cookie before any
 * event is accepted. Identity always comes from the verified session cookie —
 * never from a client-supplied value.
 */
export function authenticateSocket(socket: Socket, next: (err?: Error | undefined) => void) {
    const token = getCookie(socket.handshake.headers.cookie, "access_token");

    if (!token) {
        return next(new Error("Authentication required"));
    }

    try {
        const payload = TokenService.verifyAccessToken(token) as { userId?: string };
        if (!payload?.userId) {
            return next(new Error("Invalid session"));
        }
        socket.user = { userId: payload.userId };
        next();
    } catch {
        return next(new Error("Invalid or expired session"));
    }
}