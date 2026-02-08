import "express";

export type UserPayload = {
    id: string;
    role?: "user" | "admin";
}
declare global{
    namespace Express{
        interface Request{
            user?: UserPayload;
        }
    }
}

export {};