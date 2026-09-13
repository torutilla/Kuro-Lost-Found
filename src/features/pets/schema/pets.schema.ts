import z from "zod/v3";
import { parseGISHex } from "@shared/utils/parseGisHex.js";

export const petStatusSchema = z.enum(["lost", "found"]);
const petFilterSchema = z.union([petStatusSchema, z.enum(["all"])]).default("all");

export const GetPetParamsSchema = z.object({
    id: z.string().uuid().min(1),
});

export const GetPetsQuerySchema = z.object({
    status: petFilterSchema,
    lastDateLost: z.string().datetime().optional(),
    lastId: z.string().uuid().optional(),
}).strict();

export const PetSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string().min(1),
    type: z.string().min(1),
    breed: z.string().optional().nullable(),
    color: z.string(),
    description: z.string(),
    image_url: z.string().url(),
    status: petStatusSchema,
    last_seen_location: z.string(),
    date_lost: z.coerce.date(),
    location_point: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional().nullable(),
});

export const PetRequestSchema = PetSchema.omit({
    id: true,
    user_id: true,
});

export const cursorSchema = z.object({
    lastId: z.string().optional(),
    lastDateLost: z.date().optional(),
}).nullable().optional();


export const PetResponseSchema = PetSchema.extend({
    location_point: z.preprocess(
        (val) => (typeof val === 'string' ? parseGISHex(val) : val),
        z.object({
            lat: z.number(),
            lng: z.number(),
        })).optional().nullable()
});

export const PetArraySchema = z.object({
    pets: z.array(PetResponseSchema),
    nextCursor: cursorSchema,
});

export type PetRequest = z.infer<typeof PetRequestSchema>;
export type PetArrayResponse = z.infer<typeof PetArraySchema>;
export type Pet = z.infer<typeof PetResponseSchema>;

export type GetPetParams = z.infer<typeof GetPetParamsSchema>;
export type GetPetsQuery = z.infer<typeof GetPetsQuerySchema>;