import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phoneNumber: string;
  isVerified: boolean;
  profileImage?: string;
  isDeleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
