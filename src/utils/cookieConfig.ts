import type { CookieOptions } from "express";

export const accessTokenConfig: CookieOptions = {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
}
export const refreshTokenConfig: CookieOptions = {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
}