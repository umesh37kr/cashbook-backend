import { z } from "zod";

const phoneNumberSchema = z
  .string()
  .trim()
  .regex(
    /^[6-9]\d{9}$/,
    "Phone number must be a valid 10 digit Indian mobile number",
  );

const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "OTP must be a 6 digit number");

export const sendOtpSchema = z.object({
  phoneNumber: phoneNumberSchema,
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),

  email: z.string().trim().email().toLowerCase().optional(),

  phoneNumber: phoneNumberSchema,

  otp: otpSchema,
});

export const verifyOtpSchema = z.object({
  phoneNumber: phoneNumberSchema,

  otp: otpSchema,
});
