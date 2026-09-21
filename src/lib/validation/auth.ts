import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Please enter a valid email address").max(120);

export const loginSchema = z.object({ email });

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  email,
  phone: z
    .string()
    .trim()
    .max(25)
    .regex(/^[+()\-.\s\d]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, { error: "Please accept the terms to continue" }),
});

export const requestOtpSchema = z.discriminatedUnion("mode", [
  loginSchema.extend({ mode: z.literal("login") }),
  registerSchema.extend({ mode: z.literal("register") }),
]);

export const verifyOtpSchema = z.object({
  mode: z.enum(["login", "register"]),
  email,
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
