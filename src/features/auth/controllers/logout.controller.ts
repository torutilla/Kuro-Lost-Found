import { Request, Response } from "express";
import { accessTokenConfig, refreshTokenConfig } from "@shared/index.js";

export function logoutController(req: Request, res: Response) {
    res.clearCookie('access_token', accessTokenConfig);
    res.clearCookie('refresh_token', refreshTokenConfig);
    return res.status(200).json({ message: "Logged out successfully" });
}