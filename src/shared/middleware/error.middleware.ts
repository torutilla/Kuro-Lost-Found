import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { ZodError, z } from "zod/v3";
function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.code).json({ message: err.message });
    }
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.flatten(),
        });
    }
    console.error(err.message);
    return res.status(500).json({
        message: "Internal server error",
    });
}

export default errorMiddleware;