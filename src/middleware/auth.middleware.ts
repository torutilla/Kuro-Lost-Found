import type { Request, Response, NextFunction } from "express";
import TokenService from "../services/token.service.ts";
import { UserPayload } from "../types/express";
import { AppError } from "../utils/errors.ts";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new AppError("Unauthorized", 409);
        const token = authHeader.split(" ")[1];
        const payload = TokenService.verifyAccessToken(token);
        req.user = payload as UserPayload;
        next();
    } catch (err) {
        next(err);
        res.redirect("/login");
    }

}