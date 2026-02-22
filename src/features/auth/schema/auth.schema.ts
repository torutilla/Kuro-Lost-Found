import { z } from "zod/v3";

const UserBaseSchema = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string(),
});

export const LoginSchema = UserBaseSchema;

export const SignupSchema = UserBaseSchema.extend({
    name: z.string().min(1),
    password: UserBaseSchema.shape.password.min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type LoginType = z.infer<typeof LoginSchema>;
export type SignupType = z.infer<typeof SignupSchema>;


