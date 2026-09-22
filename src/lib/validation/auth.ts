import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Please enter a valid email address").max(120);

export const passwordRule = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/\d/, "Include at least one number");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Please enter your password").max(128),
  remember: z.boolean().optional(),
});

const registerBase = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(25)
    .regex(/^[+()\-.\s\d]+$/, "Please enter a valid phone number"),
  email,
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter your date of birth")
    .refine((d) => {
      const t = Date.parse(d);
      return !Number.isNaN(t) && t < Date.now() && t > Date.parse("1900-01-01");
    }, "Please enter a valid date of birth"),
  state: z.string().trim().min(1, "Please enter your state").max(80),
  country: z.string().trim().min(1, "Please enter your country").max(80),
  address: z.string().trim().min(1, "Please enter your address").max(200),
  password: passwordRule,
  confirmPassword: z.string(),
  consent: z.literal(true, { error: "Please accept the terms to continue" }),
});

export const registerSchema = registerBase.refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verifyOtpSchema = z.object({
  mode: z.enum(["register", "reset"]),
  email,
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const forgotSchema = z.object({ email });

export const resetSchema = z
  .object({
    email,
    code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
