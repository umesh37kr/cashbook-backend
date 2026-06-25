import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../common/catchAsync.js";

import * as AuthService from "./auth.service.js";

import { sendResponse } from "../../utils/response.js";

// Send OTP
export const sendOTP = catchAsync(async (req, res) => {
  await AuthService.sendOTP(req.body.phoneNumber);

  sendResponse(res, 200, true, "OTP sent successfully");
});

//   Register
export const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, 201, true, "Registration successful", result);
});

//   Verify OTP
export const verifyOTP = catchAsync(async (req, res) => {
  const result = await AuthService.verifyOTP(
    req.body.phoneNumber,
    req.body.otp,
  );

  sendResponse(res, 200, true, "Login successful", result);
});
