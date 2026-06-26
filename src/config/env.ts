import dotenv from "dotenv";
import { cleanEnv, str, num } from "envalid";

dotenv.config();

const validatedEnv = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
  }),

  PORT: num(),

  API_PREFIX: str(),

  MONGODB_URI: str(),

  JWT_ACCESS_SECRET: str(),

  JWT_REFRESH_SECRET: str(),

  JWT_ACCESS_EXPIRES_IN: str(),

  JWT_REFRESH_EXPIRES_IN: str(),

  OTP_EXPIRY_MINUTES: num(),

  OTP_RESEND_COOLDOWN_SECONDS: num(),

  OTP_MAX_ATTEMPTS: num(),

  SMS_PROVIDER: str(),

  MSG91_AUTH_KEY: str({
    default: "",
  }),

  LOG_LEVEL: str({
    default: "info",
  }),
});

export const env = {
  NODE_ENV: validatedEnv.NODE_ENV,

  PORT: validatedEnv.PORT,

  API_PREFIX: validatedEnv.API_PREFIX,

  DATABASE: {
    URI: validatedEnv.MONGODB_URI,
  },

  JWT: {
    ACCESS_SECRET: validatedEnv.JWT_ACCESS_SECRET,
    REFRESH_SECRET: validatedEnv.JWT_REFRESH_SECRET,
    ACCESS_EXPIRES_IN: validatedEnv.JWT_ACCESS_EXPIRES_IN,

    REFRESH_EXPIRES_IN: validatedEnv.JWT_REFRESH_EXPIRES_IN,
  },

  OTP: {
    EXPIRY_MINUTES: validatedEnv.OTP_EXPIRY_MINUTES,

    RESEND_COOLDOWN: validatedEnv.OTP_RESEND_COOLDOWN_SECONDS,

    MAX_ATTEMPTS: validatedEnv.OTP_MAX_ATTEMPTS,
  },

  SMS: {
    PROVIDER: validatedEnv.SMS_PROVIDER,
    MSG91_AUTH_KEY: validatedEnv.MSG91_AUTH_KEY,
  },

  LOGGER: {
    LEVEL: validatedEnv.LOG_LEVEL,
  },
} as const;
