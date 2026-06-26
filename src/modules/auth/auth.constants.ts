import { AUTH_CONSTANTS } from "../../common/constants/auth.constants.js";

export const AUTH_MESSAGES = {
  OTP_SENT: "OTP sent successfully",
  REGISTRATION_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  USER_ALREADY_EXISTS: "User already exists with this mobile number",
  USER_NOT_FOUND: "User not found with this mobile number",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP expired",
  OTP_RESEND_COOLDOWN: `Please wait ${AUTH_CONSTANTS.OTP_RESEND_COOLDOWN} seconds before requesting another OTP`,
  OTP_ATTEMPTS_EXCEEDED: "Maximum OTP attempts exceeded. Please request a new OTP",
} as const;

export { AUTH_CONSTANTS };
