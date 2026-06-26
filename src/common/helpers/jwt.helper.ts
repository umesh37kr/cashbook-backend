import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";

import type { JwtPayload } from "../interfaces/jwt-payload.interface.js";

// Generate Access Token
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,

    env.JWT.ACCESS_SECRET as Secret,

    {
      expiresIn: env.JWT.ACCESS_EXPIRES_IN,
    } as SignOptions,
  );
};

// Refresh Token
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,

    env.JWT.REFRESH_SECRET as Secret,

    {
      expiresIn: env.JWT.REFRESH_EXPIRES_IN,
    } as SignOptions,
  );
};

// Verify Access Token
export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

// Verify Access Token
// export const verifyAccessToken = (token: string): JwtPayload => {
//   return jwt.verify(token, env.JWT.ACCESS_SECRET) as JwtPayload;
// };

// Verify Refresh Token
// export const verifyRefreshToken = (token: string): JwtPayload => {
//   return jwt.verify(
//     token,

//     env.JWT.REFRESH_SECRET,
//   ) as JwtPayload;
// };

// Decode Token
export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
