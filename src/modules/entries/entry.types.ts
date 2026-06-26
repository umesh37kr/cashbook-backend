import type { QueryFilter } from "mongoose";
import type {
  EntryType,
  IBookEntry,
  PaymentMode,
} from "../../models/book-entry.model.js";

export interface CreateEntryDto {
  type: EntryType;
  amount: number;
  entryDate: Date;
  remark?: string;
  category?: string;
  paymentMode: PaymentMode;
}

export interface UpdateEntryDto {
  type?: EntryType;
  amount?: number;
  entryDate?: Date;
  remark?: string;
  category?: string;
  paymentMode?: PaymentMode;
}

export interface EntryFilters {
  search?: string;
  type?: EntryType;
  paymentMode?: PaymentMode;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
}

export type EntryMongoFilter = QueryFilter<IBookEntry>;

export interface EntryResponse {
  id: string;
  bookId: string;
  type: EntryType;
  amount: number;
  entryDate: Date;
  remark?: string;
  category?: string;
  paymentMode: PaymentMode;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntryTotals {
  totalIn: number;
  totalOut: number;
  balance: number;
  entriesCount: number;
}

export interface EntriesListResponse {
  entries: EntryResponse[];
  totals: EntryTotals;
}

export const toEntryResponse = (entry: IBookEntry): EntryResponse => {
  const response: EntryResponse = {
    id: entry._id.toString(),
    bookId: entry.bookId.toString(),
    type: entry.type,
    amount: entry.amount,
    entryDate: entry.entryDate,
    paymentMode: entry.paymentMode,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };

  if (entry.remark) {
    response.remark = entry.remark;
  }

  if (entry.category) {
    response.category = entry.category;
  }

  return response;
};
