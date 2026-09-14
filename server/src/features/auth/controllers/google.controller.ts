import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@config/cookie.config.js";
import { env } from "@config/env.js";
import { sendSuccess } from "@shared/index.js";

const OAUTH_STATE_COOKIE = "oauth_state";

export function googleController(req: Request, res: Response) {
    const state = crypto.randomBytes(32).toString("hex");
    const redirectUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: env.GOOGLE_CLIENT_ID,
            redirect_uri: `${env.SERVER_URL}/auth/google/callback`,
            response_type: "code",
            scope: "openid email profile",
            state,
        });
    res.cookie(OAUTH_STATE_COOKIE, state, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        maxAge: 10 * 60 * 1000,
    });
    res.redirect(redirectUrl);
}

export async function googleCallbackController(req: Request, res: Response, next: NextFunction) {
    try {
        const code = req.query.code as string;
        const state = req.query.state as string;

        if (!state || !req.cookies[OAUTH_STATE_COOKIE] || state !== req.cookies[OAUTH_STATE_COOKIE]) {
            res.clearCookie(OAUTH_STATE_COOKIE);
            return res.status(400).json({ message: "Invalid OAuth state" });
        }
        res.clearCookie(OAUTH_STATE_COOKIE);

        const { accessToken, refreshToken, user } = await AuthService.handleGoogleCallback(code);

        res.cookie("access_token", accessToken, accessTokenConfig);
        res.cookie("refresh_token", refreshToken, refreshTokenConfig);
        sendSuccess(res, {
            message: "Logged in successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
}