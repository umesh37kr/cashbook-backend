import { Router } from "express";

import * as AuthController from "./auth.controller.js";

import { validateRequest } from "../../middleware/validate.middleware.js";

import {
  sendOtpSchema,
  registerSchema,
  verifyOtpSchema,
} from "./auth.validation.js";

const router = Router();

router.post(
  "/send-otp",
  validateRequest(sendOtpSchema),
  AuthController.sendOTP,
);

router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.register,
);

router.post(
  "/login/send-otp",
  validateRequest(sendOtpSchema),
  AuthController.sendOTP,
);

router.post(
  "/login/verify-otp",
  validateRequest(verifyOtpSchema),
  AuthController.verifyOTP,
);

export default router;
