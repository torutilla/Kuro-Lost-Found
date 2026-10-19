import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { clearAccessTokenConfig, clearRefreshTokenConfig } from "@config/cookie.config.js";
import { sendSuccess } from "@shared/index.js";

export async function logoutController(req: Request, res: Response, next: NextFunction) {
    try {
        const { refresh_token } = req.cookies;
        await AuthService.logout(refresh_token);

        // Clear configs carry no `maxAge`, so browsers actually delete the
        // cookies instead of re-issuing them for another session.
        res.clearCookie('access_token', clearAccessTokenConfig);
        res.clearCookie('refresh_token', clearRefreshTokenConfig);
        sendSuccess(res, {
            message: "Logged out successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}