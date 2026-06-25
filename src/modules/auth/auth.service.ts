import { OTP } from "../../models/otp.model.js";
import { User } from "../../models/user.model.js";

import { generateOTP } from "../../utils/otp.js";

import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

import { AppError } from "../../common/AppError.js";

// sendOTP
export const sendOTP = async (phoneNumber: string) => {
  const otp = generateOTP();

  await OTP.deleteMany({
    phoneNumber,
  });

  await OTP.create({
    phoneNumber,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  console.log("OTP =>", otp);

  return true;
};
// TO DO:  will become MSG91 integration.
// registerUser
export const register = async (payload: {
  name: string;
  email?: string;
  phoneNumber: string;
  otp: string;
}) => {
  const { name, email, phoneNumber, otp } = payload;

  // Check existing user:
  const existingUser = await User.findOne({
    phoneNumber,
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }
  // Check OTP:
  const otpRecord = await OTP.findOne({
    phoneNumber,
    otp,
    isUsed: false,
  });

  if (!otpRecord) {
    throw new AppError("Invalid OTP", 400);
  }
  // Check expiry:
  if (otpRecord.expiresAt < new Date()) {
    throw new AppError("OTP expired", 400);
  }
  // Create user:
  //   const user = await User.create({
  //     name,
  //     email,
  //     phoneNumber,
  //   });

  const newUser = new User({
    name,
    email,
    phoneNumber,
  });
  const user = await User.create(newUser);

  // Mark OTP used:
  otpRecord.isUsed = true;
  await otpRecord.save();

  // Generate tokens:
  const accessToken = generateAccessToken({
    userId: user._id,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  // Return:
  return {
    user,
    accessToken,
    refreshToken,
  };
};

// verifyOTP (Login)
export const verifyOTP = async (phoneNumber: string, otp: string) => {
  //   Find user:
  const user = await User.findOne({
    phoneNumber,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }
  //   Find OTP:
  const otpRecord = await OTP.findOne({
    phoneNumber,
    otp,
    isUsed: false,
  });

  if (!otpRecord) {
    throw new AppError("Invalid OTP", 400);
  }
  //   Expire check:
  if (otpRecord.expiresAt < new Date()) {
    throw new AppError("OTP expired", 400);
  }
  //   Mark OTP used:
  otpRecord.isUsed = true;

  await otpRecord.save();
  //   Generate tokens:
  const accessToken = generateAccessToken({
    userId: user._id,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  //   return:
  return {
    user,
    accessToken,
    refreshToken,
  };
};
