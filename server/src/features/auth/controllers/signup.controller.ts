import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@/config/cookie.config.js";
import type { SignupType } from "../index.js";
import { sendSuccess } from "@shared/index.js";

export async function SignupController(req: Request<{}, {}, SignupType>, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;

    try {
        const { accessToken, refreshToken, user } = await AuthService.register(
            {
                email: email,
                password: password,
                name: name
            }
        );

        res.cookie("access_token", accessToken, accessTokenConfig);
        res.cookie("refresh_token", refreshToken, refreshTokenConfig);

        sendSuccess(res, {
            message: "Signed up successfully",
            data: user,
        });

    } catch (err) {
        next(err);
    }

}