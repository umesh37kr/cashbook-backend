import { NotFoundError } from "../../common/errors/AppError.js";
import * as BookRepository from "../books/book.repository.js";
import { BOOK_MESSAGES } from "../books/book.constants.js";
import { ENTRY_MESSAGES } from "./entry.constants.js";
import * as EntryRepository from "./entry.repository.js";
import type {
  CreateEntryDto,
  EntriesListResponse,
  EntryFilters,
  EntryResponse,
  UpdateEntryDto,
} from "./entry.types.js";
import { toEntryResponse } from "./entry.types.js";

const assertBookExists = async (
  userId: string,
  bookId: string,
): Promise<void> => {
  const book = await BookRepository.findBookByIdAndUser(userId, bookId);

  if (!book) {
    throw new NotFoundError(BOOK_MESSAGES.NOT_FOUND);
  }
};

export const createEntry = async (
  userId: string,
  bookId: string,
  payload: CreateEntryDto,
): Promise<EntryResponse> => {
  await assertBookExists(userId, bookId);

  const entry = await EntryRepository.createEntry(userId, bookId, payload);

  return toEntryResponse(entry);
};

export const getEntries = async (
  userId: string,
  bookId: string,
  filters: EntryFilters,
): Promise<EntriesListResponse> => {
  await assertBookExists(userId, bookId);

  const [entries, totals] = await Promise.all([
    EntryRepository.findEntries(userId, bookId, filters),
    EntryRepository.getEntryTotals(userId, bookId, filters),
  ]);

  return {
    entries: entries.map(toEntryResponse),
    totals,
  };
};

export const getEntryById = async (
  userId: string,
  bookId: string,
  entryId: string,
): Promise<EntryResponse> => {
  await assertBookExists(userId, bookId);

  const entry = await EntryRepository.findEntryById(userId, bookId, entryId);

  if (!entry) {
    throw new NotFoundError(ENTRY_MESSAGES.NOT_FOUND);
  }

  return toEntryResponse(entry);
};

export const updateEntry = async (
  userId: string,
  bookId: string,
  entryId: string,
  payload: UpdateEntryDto,
): Promise<EntryResponse> => {
  await assertBookExists(userId, bookId);

  const entry = await EntryRepository.updateEntry(
    userId,
    bookId,
    entryId,
    payload,
  );

  if (!entry) {
    throw new NotFoundError(ENTRY_MESSAGES.NOT_FOUND);
  }

  return toEntryResponse(entry);
};

export const deleteEntry = async (
  userId: string,
  bookId: string,
  entryId: string,
): Promise<void> => {
  await assertBookExists(userId, bookId);

  const entry = await EntryRepository.softDeleteEntry(userId, bookId, entryId);

  if (!entry) {
    throw new NotFoundError(ENTRY_MESSAGES.NOT_FOUND);
  }
};
