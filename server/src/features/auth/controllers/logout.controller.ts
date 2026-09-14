import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@config/cookie.config.js";
import { sendSuccess } from "@shared/index.js";

export async function logoutController(req: Request, res: Response, next: NextFunction) {
    try {
        const { refresh_token } = req.cookies;
        await AuthService.logout(refresh_token);

        res.clearCookie('access_token', accessTokenConfig);
        res.clearCookie('refresh_token', refreshTokenConfig);
        sendSuccess(res, {
            message: "Logged out successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}