import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.ts";
import { UserPayload } from "../types/express";
import TokenService from "../services/token.service.ts";
import AuthService from "../services/auth.service.ts";
function refreshController(req: Request, res: Response, next: NextFunction) {
    try {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            throw new AppError("Unauthorized", 401);
        }

        const payload = TokenService.verifyRefreshToken(refresh_token) as UserPayload;

        const userId = payload.userId;

        const user = AuthService.getUserFromId(userId);

        if (!user) {
            throw new Error("User not found");
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
}

export default refreshController;