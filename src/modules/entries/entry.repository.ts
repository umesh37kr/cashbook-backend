import { Types } from "mongoose";
import { BookEntry } from "../../models/book-entry.model.js";
import type { IBookEntry } from "../../models/book-entry.model.js";
import type {
  CreateEntryDto,
  EntryFilters,
  EntryMongoFilter,
  EntryTotals,
  UpdateEntryDto,
} from "./entry.types.js";

const getBaseFilter = (
  userId: string,
  bookId: string,
): EntryMongoFilter | null => {
  if (!Types.ObjectId.isValid(bookId)) {
    return null;
  }

  return {
    userId: new Types.ObjectId(userId),
    bookId: new Types.ObjectId(bookId),
    isDeleted: false,
  };
};

const buildFilter = (
  userId: string,
  bookId: string,
  filters: EntryFilters = {},
): EntryMongoFilter | null => {
  const filter = getBaseFilter(userId, bookId);

  if (!filter) {
    return null;
  }

  if (filters.type) {
    filter.type = filters.type;
  }

  if (filters.paymentMode) {
    filter.paymentMode = filters.paymentMode;
  }

  if (filters.category) {
    filter.category = new RegExp(filters.category, "i");
  }

  if (filters.fromDate || filters.toDate) {
    filter.entryDate = {};

    if (filters.fromDate) {
      filter.entryDate.$gte = filters.fromDate;
    }

    if (filters.toDate) {
      filter.entryDate.$lte = filters.toDate;
    }
  }

  if (filters.search) {
    filter.$or = [
      {
        remark: new RegExp(filters.search, "i"),
      },
      {
        category: new RegExp(filters.search, "i"),
      },
    ];
  }

  return filter;
};

export const createEntry = async (
  userId: string,
  bookId: string,
  payload: CreateEntryDto,
): Promise<IBookEntry> => {
  return BookEntry.create({
    userId,
    bookId,
    ...payload,
  });
};

export const findEntries = async (
  userId: string,
  bookId: string,
  filters?: EntryFilters,
): Promise<IBookEntry[]> => {
  const filter = buildFilter(userId, bookId, filters);

  if (!filter) {
    return [];
  }

  return BookEntry.find(filter).sort({ entryDate: -1, createdAt: -1 });
};

export const findEntryById = async (
  userId: string,
  bookId: string,
  entryId: string,
): Promise<IBookEntry | null> => {
  if (!Types.ObjectId.isValid(entryId)) {
    return null;
  }

  const filter = getBaseFilter(userId, bookId);

  if (!filter) {
    return null;
  }

  return BookEntry.findOne({
    ...filter,
    _id: entryId,
  });
};

export const updateEntry = async (
  userId: string,
  bookId: string,
  entryId: string,
  payload: UpdateEntryDto,
): Promise<IBookEntry | null> => {
  if (!Types.ObjectId.isValid(entryId)) {
    return null;
  }

  const filter = getBaseFilter(userId, bookId);

  if (!filter) {
    return null;
  }

  return BookEntry.findOneAndUpdate(
    {
      ...filter,
      _id: entryId,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
};

export const softDeleteEntry = async (
  userId: string,
  bookId: string,
  entryId: string,
): Promise<IBookEntry | null> => {
  if (!Types.ObjectId.isValid(entryId)) {
    return null;
  }

  const filter = getBaseFilter(userId, bookId);

  if (!filter) {
    return null;
  }

  return BookEntry.findOneAndUpdate(
    {
      ...filter,
      _id: entryId,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );
};

export const getEntryTotals = async (
  userId: string,
  bookId: string,
  filters?: EntryFilters,
): Promise<EntryTotals> => {
  const filter = buildFilter(userId, bookId, filters);

  if (!filter) {
    return {
      totalIn: 0,
      totalOut: 0,
      balance: 0,
      entriesCount: 0,
    };
  }

  const totals = await BookEntry.aggregate<{
    totalIn: number;
    totalOut: number;
    entriesCount: number;
  }>([
    {
      $match: filter,
    },
    {
      $group: {
        _id: null,
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
