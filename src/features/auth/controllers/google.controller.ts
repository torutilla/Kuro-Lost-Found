import type { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@shared/index.js";
export function googleController(req: Request, res: Response) {
    const redirectUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            redirect_uri: `${process.env.SERVER_URL}/auth/google/callback`,
            response_type: "code",
            scope: "openid email profile",
            state: "random_csrf_token",
        });
    res.redirect(redirectUrl);
}

export async function googleCallbackController(req: Request, res: Response, next: NextFunction) {
    try {
        const code = req.query.code as string;

        const { user, access_token, refresh_token } = await AuthService.handleGoogleCallback(code);

        res.cookie("access_token", access_token, accessTokenConfig);
        res.cookie("refresh_token", refresh_token, refreshTokenConfig);
        res.json(user);

    } catch (error) {
        next(error);
    }
}