import type { Request, Response, NextFunction } from "express";
import TokenService from "@features/auth/services/token.service.js";
import { AppError, UserPayload } from "../shared/index.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { access_token } = req.cookies;
        if (!access_token) {
            throw new AppError("No token provided", 401);
        }
        try {
            const payload = TokenService.verifyAccessToken(access_token);
            req.user = payload as UserPayload;
        } catch (_) {
            throw new AppError("Invalid or expired token", 401);
        }
        next();
    } catch (err) {
        next(err);
    }

}