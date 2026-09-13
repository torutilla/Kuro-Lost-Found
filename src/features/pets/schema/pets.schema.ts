import z from "zod/v3";
import { parseGISHex } from "@shared/utils/parseGisHex.js";

export const petStatusSchema = z.enum(["draft", "lost", "found", "reunited", "archived"]);
const visiblePetStatusSchema = z.enum(["lost", "found"]);
const pointSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
});

export const GetPetParamsSchema = z.object({ id: z.string().uuid() });
export const GetPetsQuerySchema = z.object({
    status: visiblePetStatusSchema.optional(),
    lastObservedAt: z.string().datetime().optional(),
    lastId: z.string().uuid().optional(),
}).strict();

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
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
});

export const PetRequestSchema = PetSchema.omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
}).extend({ status: z.enum(["draft", "lost", "found"]).default("draft") });

export const PetStatusUpdateSchema = z.object({ status: petStatusSchema });

export const PetResponseSchema = PetSchema.extend({
    location_point: z.preprocess(
        (val) => (typeof val === "string" ? parseGISHex(val) : val),
        pointSchema,
    ),
});

export const PetArraySchema = z.object({
    pets: z.array(PetResponseSchema),
    nextCursor: z.object({
        lastId: z.string().uuid(),
        lastObservedAt: z.coerce.date(),
    }).nullable(),
});

export type PetRequest = z.infer<typeof PetRequestSchema>;
export type PetStatusUpdate = z.infer<typeof PetStatusUpdateSchema>;
export type Pet = z.infer<typeof PetResponseSchema>;
export type GetPetsQuery = z.infer<typeof GetPetsQuerySchema>;
export type GetPetParams = z.infer<typeof GetPetParamsSchema>;
