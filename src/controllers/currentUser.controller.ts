import type { NextFunction, Request, Response } from "express";
import TokenService from "../services/token.service.ts";
import AuthService from "../services/auth.service.ts";
import type { UserPayload } from "../types/express";
async function getCurrentUserController(req: Request, res: Response, next: NextFunction) {
    try {

        const { access_token } = req.cookies;

        if (!access_token) {
            return res.status(401).json({ message: "No token" });
        }

        const payload = TokenService.verifyAccessToken(access_token) as UserPayload;
        const user = await AuthService.getUserFromId(payload.userId);

        res.json(user);
    } catch (error) {
        console.error("ERROR IN /me:", error);
        next(error);
    }
}


export default getCurrentUserController;