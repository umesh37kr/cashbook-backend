import {
  compareOTP,
  generateOTP,
  getOTPExpiry,
  hashOTP,
} from "../../common/helpers/otp.helper.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/helpers/jwt.helper.js";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/errors/AppError.js";
import { smsProvider } from "../../common/helpers/sms.helper.js";
import { AUTH_CONSTANTS, AUTH_MESSAGES } from "./auth.constants.js";
import type { AuthPurpose, AuthResponse, RegisterDto } from "./auth.types.js";
import { toAuthUser } from "./auth.types.js";
import * as AuthRepository from "./auth.repository.js";

type AuthUserDocument = Awaited<ReturnType<typeof AuthRepository.createUser>>;

const assertCanRequestOtp = async (
  phoneNumber: string,
  purpose: AuthPurpose,
) => {
  const existingUser = await AuthRepository.findUserByPhoneNumber(phoneNumber);

  if (purpose === "register" && existingUser) {
    throw new ConflictError(AUTH_MESSAGES.USER_ALREADY_EXISTS);
  }

  if (purpose === "login" && !existingUser) {
    throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
  }

  const latestOtp = await AuthRepository.findLatestActiveOtp(phoneNumber);

  if (!latestOtp) {
    return;
  }

  const cooldownEndsAt = new Date(
    latestOtp.createdAt.getTime() + AUTH_CONSTANTS.OTP_RESEND_COOLDOWN * 1000,
  );

  if (cooldownEndsAt > new Date()) {
    throw new BadRequestError(AUTH_MESSAGES.OTP_RESEND_COOLDOWN);
  }
};

const issueOtp = async (phoneNumber: string): Promise<void> => {
  const otp = generateOTP();
  const hashedOtp = await hashOTP(otp);

  await AuthRepository.deleteActiveOtps(phoneNumber);

  await AuthRepository.createOtp(
    phoneNumber,
    hashedOtp,
    getOTPExpiry(),
  );

  await smsProvider.sendOTP(phoneNumber, otp);
};

const verifyOtpOrThrow = async (phoneNumber: string, otp: string) => {
  const otpRecord = await AuthRepository.findLatestActiveOtp(phoneNumber);

  if (!otpRecord) {
    throw new BadRequestError(AUTH_MESSAGES.INVALID_OTP);
  }

  if (otpRecord.expiresAt < new Date()) {
    await AuthRepository.markOtpUsed(otpRecord);
    throw new BadRequestError(AUTH_MESSAGES.OTP_EXPIRED);
  }

  if (otpRecord.attempts >= AUTH_CONSTANTS.OTP_MAX_ATTEMPTS) {
    await AuthRepository.markOtpUsed(otpRecord);
    throw new BadRequestError(AUTH_MESSAGES.OTP_ATTEMPTS_EXCEEDED);
  }

  const isOtpValid = await compareOTP(otp, otpRecord.otp);

  if (!isOtpValid) {
    await AuthRepository.incrementOtpAttempts(otpRecord);
    throw new BadRequestError(AUTH_MESSAGES.INVALID_OTP);
  }

  await AuthRepository.markOtpUsed(otpRecord);
};

const createAuthResponse = (user: AuthUserDocument): AuthResponse => {
  const accessToken = generateAccessToken({
    sub: user._id.toString(),
    type: "access",
  });

  const refreshToken = generateRefreshToken({
    sub: user._id.toString(),
    type: "refresh",
  });

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
  };
};

export const sendRegisterOTP = async (phoneNumber: string): Promise<void> => {
  await assertCanRequestOtp(phoneNumber, "register");
  await issueOtp(phoneNumber);
};

export const sendLoginOTP = async (phoneNumber: string): Promise<void> => {
  await assertCanRequestOtp(phoneNumber, "login");
  await issueOtp(phoneNumber);
};

export const register = async (payload: RegisterDto): Promise<AuthResponse> => {
  const existingUser = await AuthRepository.findUserByPhoneNumber(
    payload.phoneNumber,
  );

  if (existingUser) {
    throw new ConflictError(AUTH_MESSAGES.USER_ALREADY_EXISTS);
  }

  await verifyOtpOrThrow(payload.phoneNumber, payload.otp);

  const user = await AuthRepository.createUser(payload);

  return createAuthResponse(user);
};

export const verifyLoginOTP = async (
  phoneNumber: string,
  otp: string,
): Promise<AuthResponse> => {
  const user = await AuthRepository.findUserByPhoneNumber(phoneNumber);

  if (!user) {
    throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
  }

  await verifyOtpOrThrow(phoneNumber, otp);

  return createAuthResponse(user);
};
