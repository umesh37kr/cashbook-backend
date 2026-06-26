import { Schema, model, Document, Types } from "mongoose";

export type EntryType = "cash_in" | "cash_out";
export type PaymentMode = "cash" | "online";

export interface IBookEntry extends Document {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  type: EntryType;
  amount: number;
  entryDate: Date;
  remark?: string;
  category?: string;
  paymentMode: PaymentMode;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookEntrySchema = new Schema<IBookEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["cash_in", "cash_out"],
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    entryDate: {
      type: Date,
      required: true,
      index: true,
    },

    remark: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 80,
      index: true,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "online"],
      required: true,
      index: true,
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

bookEntrySchema.index({ userId: 1, bookId: 1, entryDate: -1 });
bookEntrySchema.index({ remark: "text", category: "text" });

export const BookEntry = model<IBookEntry>("BookEntry", bookEntrySchema);
