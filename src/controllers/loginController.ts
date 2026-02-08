import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/authService.ts";
import { accessTokenConfig, refreshTokenConfig } from "../utils/cookieConfig.ts";

export default async function LoginController(req: Request, res: Response, next: NextFunction) {
    const request = req.body;

    try {
        const login = await AuthService.login(request.email, request.password);

        res.cookie("access_token", login.accessToken, accessTokenConfig);

        res.cookie("refresh_token", login.refreshToken, refreshTokenConfig);

        res.json(login.user);
    } catch (err) {
        next(err);
    }
}