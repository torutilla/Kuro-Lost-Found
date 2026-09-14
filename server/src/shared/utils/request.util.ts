import { NextFunction, RequestHandler, Request, Response } from "express";

export const createHandler = <
    TParams = any,
    TBody = any,
    TQuery = any>(
        handler: (req: Request<TParams, any, TBody, TQuery>, res: Response, next: NextFunction) => Promise<void> | void
    ): RequestHandler<TParams, any, TBody, TQuery> => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
};