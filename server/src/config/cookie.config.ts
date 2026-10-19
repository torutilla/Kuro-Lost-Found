import type { CookieOptions } from "express";

const baseCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
} satisfies CookieOptions;

export const accessTokenConfig: CookieOptions = {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 60,
};
export const refreshTokenConfig: CookieOptions = {
    ...baseCookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

/**
 * Options used when REMOVING cookies. These must never include `maxAge`:
 * Express forwards options straight into the `Set-Cookie` header, and browsers
 * give a positive `Max-Age` precedence over the epoch `Expires` that
 * `res.clearCookie` sets — which would silently keep the session alive.
 */
export const clearAccessTokenConfig: CookieOptions = { ...baseCookieOptions };
export const clearRefreshTokenConfig: CookieOptions = { ...baseCookieOptions };