import z from "zod/v3";
import { PetFilter } from "../types/pets.type.js";

export const PetParamsSchema = z.object({
    id: z.string().min(1),
});

export const GetPetsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.enum(["lost", "found", "all"]).default("all"),
})

export type GetPetsQuery = z.infer<typeof GetPetsQuerySchema>;