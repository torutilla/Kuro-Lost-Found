import type { NextFunction, Request, Response } from "express";
import PetService from "../services/pets.service.js";
import { GetPetsQuery } from "../schema/pets.schema.js";

async function getPetsController(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, status } = req.query as unknown as GetPetsQuery;
        const result = await PetService.getPets(page, status);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export default getPetsController;