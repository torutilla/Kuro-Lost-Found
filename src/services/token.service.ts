import jwt from "jsonwebtoken";
export default class TokenService {

    static generateAccessToken(payload: string | object): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
    }

    static verifyAccessToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!)
    }

    static generateRefreshToken(payload: string | object): string {
        return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
    }

    static async revokeRefreshToken(token: string) {
    }

    static verifyRefreshToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!)
    }
}