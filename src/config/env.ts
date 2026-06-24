import dotenv from "dotenv";
import { cleanEnv, str, port } from "envalid";
dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: port(),

  NODE_ENV: str(),

  MONGODB_URI: str(),

  JWT_ACCESS_SECRET: str(),

  JWT_REFRESH_SECRET: str(),
});
