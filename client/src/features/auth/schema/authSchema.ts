import { z } from "zod/v3";

const UserBaseSchema = z.object({
    email: z.string().min(1, "Email is required").email("That doesn't look like a valid email address").trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
});

export const LoginSchema = UserBaseSchema;

export const PasswordSchema = UserBaseSchema.shape.password.min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")

export const SignupSchema = UserBaseSchema.extend({
    name: z.string().min(1, "Name is required").trim(),
    password: PasswordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignupType = z.infer<typeof SignupSchema>;

export type LoginType = z.infer<typeof LoginSchema>;


