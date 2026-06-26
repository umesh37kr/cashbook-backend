import type { Types } from "mongoose";
import type { IBook } from "../../models/book.model.js";

export interface CreateBookDto {
  title: string;
  description?: string;
}

export interface UpdateBookDto {
  title?: string;
  description?: string;
}

export interface BookSummary {
  id: string;
  title: string;
  description?: string;
  totalIn: number;
  totalOut: number;
  balance: number;
  entriesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookTotals {
  totalIn: number;
  totalOut: number;
  balance: number;
  entriesCount: number;
}

export interface BookTotalsRow {
  _id: Types.ObjectId;
  totalIn: number;
  totalOut: number;
  entriesCount: number;
}

export const toBookSummary = (
  book: IBook,
  totals?: Partial<BookTotals>,
): BookSummary => {
  const totalIn = totals?.totalIn ?? 0;
  const totalOut = totals?.totalOut ?? 0;
  const summary: BookSummary = {
    id: book._id.toString(),
    title: book.title,
    totalIn,
    totalOut,
    balance: totals?.balance ?? totalIn - totalOut,
    entriesCount: totals?.entriesCount ?? 0,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };

  if (book.description) {
    summary.description = book.description;
  }

  return summary;
};
