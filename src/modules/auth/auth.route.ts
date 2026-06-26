import { Router } from "express";

import * as AuthController from "./auth.controller.js";

import { validate } from "../../common/middlewares/validate.middleware.js";

import {
  sendOtpSchema,
  registerSchema,
  verifyOtpSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/send-otp", validate(sendOtpSchema), AuthController.sendOTP);

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login/send-otp", validate(sendOtpSchema), AuthController.sendOTP);

router.post(
  "/login/verify-otp",
  validate(verifyOtpSchema),
  AuthController.verifyOTP,
);

export default router;
