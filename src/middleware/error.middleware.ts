import type{ Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.ts";
function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction){
    if (err instanceof AppError) {
        return res.status(err.code).json({ message: err.message });
    }
    return res.status(500).json({
        message: "Internal server error",
    });
}

export default errorMiddleware;