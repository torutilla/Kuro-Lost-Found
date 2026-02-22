import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@shared/index.js";
import { LoginType } from "../index.js";


export default async function LoginController(req: Request<{}, {}, LoginType>, res: Response, next: NextFunction) {
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