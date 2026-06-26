import { Types } from "mongoose";
import { Book } from "../../models/book.model.js";
import type { IBook } from "../../models/book.model.js";
import { BookEntry } from "../../models/book-entry.model.js";
import type {
  BookTotals,
  BookTotalsRow,
  CreateBookDto,
  UpdateBookDto,
} from "./book.types.js";

export const createBook = async (
  userId: string,
  payload: CreateBookDto,
): Promise<IBook> => {
  return Book.create({
    userId,
    ...payload,
  });
};

export const findBookByTitle = async (
  userId: string,
  title: string,
): Promise<IBook | null> => {
  return Book.findOne({
    userId,
    title,
    isDeleted: false,
  });
};

export const findBooksByUser = async (userId: string): Promise<IBook[]> => {
  return Book.find({
    userId,
    isDeleted: false,
  }).sort({ updatedAt: -1 });
};

export const findBookByIdAndUser = async (
  userId: string,
  bookId: string,
): Promise<IBook | null> => {
  if (!Types.ObjectId.isValid(bookId)) {
    return null;
  }

  return Book.findOne({
    _id: bookId,
    userId,
    isDeleted: false,
  });
};

export const updateBook = async (
  userId: string,
  bookId: string,
  payload: UpdateBookDto,
): Promise<IBook | null> => {
  if (!Types.ObjectId.isValid(bookId)) {
    return null;
  }

  return Book.findOneAndUpdate(
    {
      _id: bookId,
      userId,
      isDeleted: false,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
};

export const softDeleteBook = async (
  userId: string,
  bookId: string,
): Promise<IBook | null> => {
  if (!Types.ObjectId.isValid(bookId)) {
    return null;
  }

  return Book.findOneAndUpdate(
    {
      _id: bookId,
      userId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
};

export const softDeleteEntriesByBook = async (
  userId: string,
  bookId: string,
): Promise<void> => {
  await BookEntry.updateMany(
    {
      userId,
      bookId,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
  );
};

export const getTotalsForBooks = async (
  userId: string,
): Promise<BookTotalsRow[]> => {
  return BookEntry.aggregate<BookTotalsRow>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$bookId",
        totalIn: {
          $sum: {
            $cond: [{ $eq: ["$type", "cash_in"] }, "$amount", 0],
          },
        },
        totalOut: {
          $sum: {
            $cond: [{ $eq: ["$type", "cash_out"] }, "$amount", 0],
          },
        },
        entriesCount: {
          $sum: 1,
        },
      },
    },
  ]);
};

export const getTotalsForBook = async (
  userId: string,
  bookId: string,
): Promise<BookTotals> => {
  const totals = await BookEntry.aggregate<BookTotalsRow>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        bookId: new Types.ObjectId(bookId),
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$bookId",
        totalIn: {
          $sum: {
            $cond: [{ $eq: ["$type", "cash_in"] }, "$amount", 0],
          },
        },
        totalOut: {
          $sum: {
            $cond: [{ $eq: ["$type", "cash_out"] }, "$amount", 0],
          },
        },
        entriesCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const totalIn = totals[0]?.totalIn ?? 0;
  const totalOut = totals[0]?.totalOut ?? 0;

  return {
    totalIn,
    totalOut,
    balance: totalIn - totalOut,
    entriesCount: totals[0]?.entriesCount ?? 0,
  };
};
