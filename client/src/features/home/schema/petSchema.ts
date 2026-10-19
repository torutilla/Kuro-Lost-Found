import z from "zod/v3";

/**
 * Report shape shared with the API. Keep this file in sync with
 * `server/src/features/pets/schema/pets.schema.ts` — the server validates every
 * request against the equivalent server-side schema.
 */
export const petStatusSchema = z.enum(["draft", "lost", "found", "reunited", "archived"]);

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
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
});

export const cursorSchema = z.object({
    lastId: z.string().optional(),
    lastDateLost: z.date(),
}).nullable().optional();

export const PetArraySchema = z.object({
    pets: z.array(PetSchema),
    nextCursor: cursorSchema,
});

/**
 * Payload for `POST /api/v1/pets/create`.
 * - `user_id` is intentionally omitted: the server derives the owner from the
 *   authenticated session, never from the browser payload.
 * - `location_point` is required: a report cannot be posted without a pinned
 *   map location.
 * - `status` mirrors the server contract (draft/lost/found on create).
 */
export const PetRequestSchema = PetSchema.omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
}).extend({ status: z.enum(["draft", "lost", "found"]).default("draft") });

export type PetRequest = z.infer<typeof PetRequestSchema>;
export type PetArrayResponse = z.infer<typeof PetArraySchema>;
export type Pet = z.infer<typeof PetSchema>