import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@config/cookie.config.js";
import type { LoginType } from "../index.js";
import { sendSuccess } from "@shared/index.js";


export default async function LoginController(req: Request<{}, {}, LoginType>, res: Response, next: NextFunction) {
    const request = req.body;

    try {
        const login = await AuthService.login(request.email, request.password);

        res.cookie("access_token", login.accessToken, accessTokenConfig);

        res.cookie("refresh_token", login.refreshToken, refreshTokenConfig);

        sendSuccess(res, {
            message: "Logged in successfully",
            data: login.user,
        });
    } catch (err) {
        next(err);
    }
}