import type { Request, Response, NextFunction } from "express";
import TokenService from "../services/token.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@config/cookie.config.js";
import { AppError, sendSuccess } from "@shared/index.js";

async function refreshController(req: Request, res: Response, next: NextFunction) {
    try {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            throw new AppError("Unauthorized", 401);
        }

        let userId: string;
        try {
            const payload = TokenService.verifyRefreshToken(refresh_token) as { userId: string };
            userId = payload.userId;
        } catch (_) {
            throw new AppError("Unauthorized", 401);
        }

        if (!(await TokenService.isRefreshTokenActive(refresh_token))) {
            throw new AppError("Unauthorized", 401);
        }

        // Rotate: revoke the old refresh token, issue a fresh pair.
        await TokenService.revokeRefreshToken(refresh_token);

        const newAccessToken = TokenService.generateAccessToken({ userId });
        const newRefreshToken = TokenService.generateRefreshToken({ userId });
        await TokenService.persistRefreshToken(userId, newRefreshToken);

        res.cookie("access_token", newAccessToken, accessTokenConfig);
        res.cookie("refresh_token", newRefreshToken, refreshTokenConfig);

        sendSuccess(res, {
            message: "Tokens refreshed successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
}

export default refreshController;