import type { NextFunction, Request, Response } from "express";
import { AppError } from "@shared/utils/errors.js";
import type { UserPayload } from "@shared/types/express.js";
import TokenService from "../services/token.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@shared/utils/cookieConfig.js";

function refreshController(req: Request, res: Response, next: NextFunction) {
    try {
        const { refresh_token } = req.cookies;

        if (!refresh_token) {
            throw new AppError("Unauthorized", 401);
        }

        const payload = TokenService.verifyRefreshToken(refresh_token) as UserPayload;

        const userId = payload.userId;

        const newAccessToken = TokenService.generateAccessToken({ userId });
        const newRefreshToken = TokenService.generateRefreshToken({ userId });

        res.cookie("access_token", newAccessToken, accessTokenConfig);
        res.cookie("refresh_token", newRefreshToken, refreshTokenConfig);

        res.status(200).json({ message: "refreshed" });
    } catch (error) {
        next(error);
    }
}

export default refreshController;