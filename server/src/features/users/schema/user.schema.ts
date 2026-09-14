import z from "zod/v3";

export const PublicUserSchema = z.object({});
export const UserRowSchema = z.object({});

export type PublicUser = z.infer<typeof PublicUserSchema>;
export type UserRow = z.infer<typeof PublicUserSchema>;