import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod/v3";
export const validateMiddleware = (schema: ZodTypeAny, source: "body" | "query" | "params") =>
    (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req[source]);
        if (!result.success) {
            next(result.error);
        }

        if (source === "query" || source === "params") {
            for (const key in req.query) delete req.query[key];
            Object.assign(req[source], result.data);
        } else {
            req[source] = result.data;
        }
        next();


    }