import { z } from "zod";

export const sendOtpSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
});

export const registerSchema = z.object({
  name: z.string().min(2),

  email: z.string().email().optional(),

  phoneNumber: z.string(),

  otp: z.string().length(6),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z.string(),

  otp: z.string().length(6),
});
