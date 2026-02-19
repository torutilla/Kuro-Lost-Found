import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@shared/utils/cookieConfig.js";

export async function SignupController(req: Request, res: Response, next: NextFunction) {
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