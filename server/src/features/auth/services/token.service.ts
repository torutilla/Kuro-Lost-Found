import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "@config/env.js";
import RefreshTokenRepository from "../repository/refreshToken.repository.js";

const sha256 = (token: string) =>
    crypto.createHash("sha256").update(token).digest("hex");

export default class TokenService {

    static generateAccessToken(payload: string | object): string {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
    }

    static verifyAccessToken(token: string) {
        return jwt.verify(token, env.JWT_SECRET)
    }

    static generateRefreshToken(payload: string | object): string {
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
    }

    static async persistRefreshToken(userId: string, token: string) {
        const { exp } = jwt.decode(token) as { exp?: number };
        const expiresAt = exp ? new Date(exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await RefreshTokenRepository.create(userId, sha256(token), expiresAt);
    }

    static async isRefreshTokenActive(token: string) {
        return !!(await RefreshTokenRepository.findActive(sha256(token)));
    }

    static async revokeRefreshToken(token: string) {
        if (!token) return;
        await RefreshTokenRepository.revoke(sha256(token));
    }

    static async revokeAllRefreshTokensForUser(userId: string) {
        await RefreshTokenRepository.revokeAllForUser(userId);
    }

    static verifyRefreshToken(token: string) {
        return jwt.verify(token, env.JWT_SECRET)
    }
}