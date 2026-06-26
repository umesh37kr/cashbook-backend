import { catchAsync } from "../../common/utils/catchAsync.js";

import * as AuthService from "./auth.service.js";

import { sendResponse } from "../../common/responses/sendResponse.js";
import { AUTH_MESSAGES } from "./auth.constants.js";

export const sendRegisterOTP = catchAsync(async (req, res) => {
  await AuthService.sendRegisterOTP(req.body.phoneNumber);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: AUTH_MESSAGES.OTP_SENT,
  });
});

export const sendLoginOTP = catchAsync(async (req, res) => {
  await AuthService.sendLoginOTP(req.body.phoneNumber);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: AUTH_MESSAGES.OTP_SENT,
  });
});

export const register = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
    data: result,
  });
});

export const verifyLoginOTP = catchAsync(async (req, res) => {
  const result = await AuthService.verifyLoginOTP(
    req.body.phoneNumber,
    req.body.otp,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    data: result,
  });
});
