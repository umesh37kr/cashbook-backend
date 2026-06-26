import type { Response } from "express";
import type { ApiResponse } from "../interfaces/api-response.interface.js";

export const sendResponse = <T>(
  res: Response,
  payload: ApiResponse<T>,
): void => {
  res.status(payload.statusCode).json({
    success: payload.success,

    statusCode: payload.statusCode,

    message: payload.message,

    data: payload.data ?? null,
  });
};

// in controller example
// sendResponse(res,{
// success:true,
// statusCode:200,
// message:"OTP Sent",
// data:user
// });
