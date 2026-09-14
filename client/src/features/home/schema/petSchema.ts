import z from "zod/v3";

export const petStatusSchema = z.enum(["lost", "found"]);

const pointSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
});

export const PetSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string().min(1),
    type: z.string().min(1),
    breed: z.string().optional().nullable(),
    color: z.string().min(1),
    description: z.string().min(1),
    image_url: z.string().url(),
    status: petStatusSchema,
    location_description: z.string().min(1),
    observed_at: z.coerce.date(),
    location_point: pointSchema,
});

export const cursorSchema = z.object({
    lastId: z.string().optional(),
    lastDateLost: z.date(),
}).nullable().optional();

export const PetArraySchema = z.object({
    pets: z.array(PetSchema),
    nextCursor: cursorSchema,
});

export const PetRequestSchema = PetSchema.omit({
    id: true
});

export type PetRequest = z.infer<typeof PetRequestSchema>;
export type PetArrayResponse = z.infer<typeof PetArraySchema>;
export type Pet = z.infer<typeof PetSchema>