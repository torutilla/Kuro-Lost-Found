import z from "zod/v3";

export const PetParamsSchema = z.object({
    id: z.string().min(1),
});

export const GetPetsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.enum(["lost", "found", "all"]).default("all"),
}).strict();

export type PetParams = z.infer<typeof PetParamsSchema>;
export type GetPetsQuery = z.infer<typeof GetPetsQuerySchema>;