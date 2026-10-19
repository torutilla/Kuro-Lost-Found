import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service.js";
import { googleRedirectUri } from "../services/google.auth.service.js";
import { accessTokenConfig, refreshTokenConfig } from "@config/cookie.config.js";
import { env } from "@config/env.js";

const OAUTH_STATE_COOKIE = "oauth_state";
const oauthStateCookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    path: "/",
};

/** Friendly failure reasons rendered by the client's `/auth/failed` route. */
type FailureReason = "declined" | "state" | "provider";

function failureRedirect(reason: FailureReason) {
    return `${env.CLIENT_URL}/auth/failed?reason=${reason}`;
}

export function googleController(req: Request, res: Response) {
    const state = crypto.randomBytes(32).toString("hex");
    const redirectUrl =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: env.GOOGLE_CLIENT_ID,
            redirect_uri: googleRedirectUri,
            response_type: "code",
            scope: "openid email profile",
            state,
        });
    res.cookie(OAUTH_STATE_COOKIE, state, {
        ...oauthStateCookieOptions,
        maxAge: 10 * 60 * 1000,
    });
    res.redirect(redirectUrl);
}

export async function googleCallbackController(req: Request, res: Response, next: NextFunction) {
    try {
        const code = typeof req.query.code === "string" ? req.query.code : undefined;
        const state = typeof req.query.state === "string" ? req.query.state : undefined;
        const providerError = typeof req.query.error === "string" ? req.query.error : undefined;

        // Consume the one-shot state cookie either way (no `maxAge` here, so
        // the browser really deletes it).
        res.clearCookie(OAUTH_STATE_COOKIE, oauthStateCookieOptions);

        // The user declined the consent screen, or Google reported an error.
        if (providerError) {
            return res.redirect(
                failureRedirect(providerError === "access_denied" ? "declined" : "provider"),
            );
        }

        // Missing, expired, or tampered state.
        const expectedState = req.cookies[OAUTH_STATE_COOKIE];
        if (!code || !state || !expectedState || state !== expectedState) {
            return res.redirect(failureRedirect("state"));
        }

        try {
            const { accessToken, refreshToken } = await AuthService.handleGoogleCallback(code);
            res.cookie("access_token", accessToken, accessTokenConfig);
            res.cookie("refresh_token", refreshToken, refreshTokenConfig);
            // Cookies are set; now send the browser to the client app.
            return res.redirect(`${env.CLIENT_URL}/home`);
        } catch {
            // Deliberately log no code/token values — only the fact of failure.
            console.error("Google OAuth callback failed while exchanging the code or reading the profile.");
            return res.redirect(failureRedirect("provider"));
        }
    } catch (error) {
        next(error);
    }
}