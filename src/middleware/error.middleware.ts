import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/index.js";
import { ZodError } from "zod/v3";
export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.code).json({ success: false, message: err.message });
    }
    if (err instanceof ZodError) {
        console.log(err.errors);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.flatten(),
        });
    }
    console.error(err.message);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}

