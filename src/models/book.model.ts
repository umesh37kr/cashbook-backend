import { Schema, model, Document, Types } from "mongoose";

export interface IBook extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
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

bookSchema.index({ userId: 1, title: 1, isDeleted: 1 });

export const Book = model<IBook>("Book", bookSchema);
