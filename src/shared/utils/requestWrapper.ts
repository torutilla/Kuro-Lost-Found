import { NextFunction, RequestHandler, Request, Response } from "express";

export const createHandler = <T>(
    handler: (req: Request<any, any, any, T>, res: Response, next: NextFunction) => Promise<void> | void
): RequestHandler => {
    return handler as RequestHandler;
};