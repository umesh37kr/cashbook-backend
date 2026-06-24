import { Schema, model, Document } from "mongoose";

export interface IOTP extends Document {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = model<IOTP>("OTP", otpSchema);
