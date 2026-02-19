import type { Request, Response, NextFunction } from "express";
import TokenService from "../../features/auth/services/token.service.js";
import type { UserPayload } from "../types/express.js";
import { AppError } from "../utils/errors.js";

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { access_token } = req.cookies;
        if (!access_token) {
            throw new AppError("No token provided", 401);
        }
        const payload = TokenService.verifyAccessToken(access_token);
        req.user = payload as UserPayload;
        next();
    } catch (err) {
        next(err);
    }

}