import bcrypt from "bcryptjs";

import dayjs from "dayjs";

import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

// generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// hash OTP
export const hashOTP = async (otp: string) => {
  return bcrypt.hash(otp, 10);
};

// Compare OTP
export const compareOTP = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};

// Check if OTP is expired
export const getOTPExpiry = () => {
  return dayjs().add(AUTH_CONSTANTS.OTP_EXPIRY_MINUTES, "minute").toDate();
};
