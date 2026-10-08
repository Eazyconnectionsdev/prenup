import { z } from "zod";
import { isValidPhone } from "@/lib/utils";

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address");

const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(50, `${label} is too long`);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required").max(72, "Password is too long"),
});

export const registerSchema = z
  .object({
    firstName: name("First name"),
    lastName: name("Last name"),
    email,
    phone: z
      .string()
      .refine(isValidPhone, "Enter a valid phone number, e.g. +14165550192"),
    password: newPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    marketingConsent: z.boolean(),
    acceptedTerms: z.boolean().refine((v) => v, {
      message: "You must accept the Terms & Conditions and Privacy Policy",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
