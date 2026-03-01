import z from "zod/v3";

export const GetPetParamsSchema = z.object({
    id: z.string().min(1),
});

export const GetPetsQuerySchema = z.object({
    status: z.enum(["lost", "found", "all"]).default("all"),
    lastDateLost: z.string().datetime().optional(),
    lastId: z.string().uuid().optional(),
}).strict();

export const PostPetSchema = z.object({
    user_id: z.string().uuid(),
    name: z.string().min(1),
    type: z.string().min(1),
    breed: z.string().optional(),
    color: z.string(),
    description: z.string(),
    image_url: z.string().url(),
    status: z.enum(["lost", "found"]).default("lost"),
    last_seen_location: z.string(),
    date_lost: z.string().datetime(),
})

export type PetRequest = z.infer<typeof PostPetSchema>;
export type GetPetParams = z.infer<typeof GetPetParamsSchema>;
export type GetPetsQuery = z.infer<typeof GetPetsQuerySchema>;