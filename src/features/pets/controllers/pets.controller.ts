import type { NextFunction, Request, Response } from "express";
import PetService from "../services/pets.service.js";
import { GetPetsQuery } from "../schema/pets.schema.js";
import { createHandler } from "../../../shared/utils/requestWrapper.js";

const getPetsController = createHandler<GetPetsQuery>(async (req, res, next) => {
    try {
        const { page, status } = req.query;
        const result = await PetService.getPets(page, status);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default getPetsController;