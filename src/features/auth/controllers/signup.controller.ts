import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@/config/cookie.config.js";
import { SignupType } from "../index.js";

export async function SignupController(req: Request<{}, {}, SignupType>, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;

    try {
        const { createdUser, access_token, refresh_token } = await AuthService.register(
            {
                email: email,
                password: password,
                name: name
            }
        );

        res.cookie("access_token", access_token, accessTokenConfig);
        res.cookie("refresh_token", refresh_token, refreshTokenConfig);

        res.json({ createdUser });

    } catch (err) {
        next(err);
    }

}