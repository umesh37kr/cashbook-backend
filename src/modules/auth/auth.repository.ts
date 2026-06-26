import { OTP } from "../../models/otp.model.js";
import type { IOTP } from "../../models/otp.model.js";
import { User } from "../../models/user.model.js";
import type { IUser } from "../../models/user.model.js";
import type { RegisterDto } from "./auth.types.js";

export const findUserByPhoneNumber = async (
  phoneNumber: string,
): Promise<IUser | null> => {
  return User.findOne({
    phoneNumber,
    isDeleted: false,
  });
};

export const createUser = async (payload: RegisterDto): Promise<IUser> => {
  const userPayload: Pick<IUser, "name" | "phoneNumber"> & { email?: string } = {
    name: payload.name,
    phoneNumber: payload.phoneNumber,
  };

  if (payload.email) {
    userPayload.email = payload.email;
  }

  return User.create(userPayload);
};

export const findLatestActiveOtp = async (
  phoneNumber: string,
): Promise<IOTP | null> => {
  return OTP.findOne({
    phoneNumber,
    isUsed: false,
  }).sort({ createdAt: -1 });
};

export const deleteActiveOtps = async (phoneNumber: string): Promise<void> => {
  await OTP.deleteMany({
    phoneNumber,
    isUsed: false,
  });
};

export const createOtp = async (
  phoneNumber: string,
  otp: string,
  expiresAt: Date,
): Promise<IOTP> => {
  return OTP.create({
    phoneNumber,
    otp,
    expiresAt,
  });
};

export const markOtpUsed = async (otpRecord: IOTP): Promise<void> => {
  otpRecord.isUsed = true;
  await otpRecord.save();
};

export const incrementOtpAttempts = async (otpRecord: IOTP): Promise<void> => {
  otpRecord.attempts += 1;
  await otpRecord.save();
};
