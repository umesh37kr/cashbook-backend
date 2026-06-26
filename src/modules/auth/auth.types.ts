import type { IUser } from "../../models/user.model.js";

export type AuthPurpose = "register" | "login";

export interface SendOtpDto {
  phoneNumber: string;
}

export interface RegisterDto {
  name: string;
  email?: string;
  phoneNumber: string;
  otp: string;
}

export interface VerifyOtpDto {
  phoneNumber: string;
  otp: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  isVerified: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const toAuthUser = (user: IUser): AuthUser => {
  const authUser: AuthUser = {
    id: user._id.toString(),
    name: user.name,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
  };

  if (user.email) {
    authUser.email = user.email;
  }

  return authUser;
};
