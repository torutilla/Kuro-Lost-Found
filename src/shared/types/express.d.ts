import "express";
import type { UserPayload } from "./userPayload.type.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export { };