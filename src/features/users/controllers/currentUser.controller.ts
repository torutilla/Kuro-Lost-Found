import type { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service.js";

async function getCurrentUserController(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.user;
        if (!payload) {
            throw new Error("User payload missing in request");
        }
        const user = await UserService.getUserFromId(payload.userId);
        res.json(user);
    } catch (error) {
        console.error("ERROR IN /me:", error);
        next(error);
    }
}


export default getCurrentUserController;