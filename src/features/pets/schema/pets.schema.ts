import z from "zod/v3";

export const PetParamsSchema = z.object({
    id: z.string().min(1),
});

export const GetPetsQuerySchema = z.object({
    status: z.enum(["lost", "found", "all"]).default("all"),
    lastDateLost: z.string().datetime().optional(),
    lastId: z.string().uuid().optional(),
}).strict();

export type PetParams = z.infer<typeof PetParamsSchema>;
export type GetPetsQuery = z.infer<typeof GetPetsQuerySchema>;