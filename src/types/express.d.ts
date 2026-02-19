import "express";

export type UserPayload = {
    userId: string;
    role?: "user" | "admin";
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export { };