import { ConflictError, NotFoundError } from "../../common/errors/AppError.js";
import { BOOK_MESSAGES } from "./book.constants.js";
import * as BookRepository from "./book.repository.js";
import type { BookSummary, CreateBookDto, UpdateBookDto } from "./book.types.js";
import { toBookSummary } from "./book.types.js";

export const createBook = async (
  userId: string,
  payload: CreateBookDto,
): Promise<BookSummary> => {
  const existingBook = await BookRepository.findBookByTitle(
    userId,
    payload.title,
  );

  if (existingBook) {
    throw new ConflictError(BOOK_MESSAGES.TITLE_EXISTS);
  }

  const book = await BookRepository.createBook(userId, payload);

  return toBookSummary(book);
};

export const getBooks = async (userId: string): Promise<BookSummary[]> => {
  const [books, totals] = await Promise.all([
    BookRepository.findBooksByUser(userId),
    BookRepository.getTotalsForBooks(userId),
  ]);

  const totalsByBookId = new Map(
    totals.map((total) => [
      total._id.toString(),
      {
        totalIn: total.totalIn,
        totalOut: total.totalOut,
        balance: total.totalIn - total.totalOut,
        entriesCount: total.entriesCount,
      },
    ]),
  );

  return books.map((book) =>
    toBookSummary(book, totalsByBookId.get(book._id.toString())),
  );
};

export const getBookById = async (
  userId: string,
  bookId: string,
): Promise<BookSummary> => {
  const book = await BookRepository.findBookByIdAndUser(userId, bookId);

  if (!book) {
    throw new NotFoundError(BOOK_MESSAGES.NOT_FOUND);
  }

  const totals = await BookRepository.getTotalsForBook(userId, bookId);

  return toBookSummary(book, totals);
};

export const updateBook = async (
  userId: string,
  bookId: string,
  payload: UpdateBookDto,
): Promise<BookSummary> => {
  if (payload.title) {
    const existingBook = await BookRepository.findBookByTitle(
      userId,
      payload.title,
    );

    if (existingBook && existingBook._id.toString() !== bookId) {
      throw new ConflictError(BOOK_MESSAGES.TITLE_EXISTS);
    }
  }

  const book = await BookRepository.updateBook(userId, bookId, payload);

  if (!book) {
    throw new NotFoundError(BOOK_MESSAGES.NOT_FOUND);
  }

  const totals = await BookRepository.getTotalsForBook(userId, bookId);

  return toBookSummary(book, totals);
};

export const deleteBook = async (
  userId: string,
  bookId: string,
): Promise<void> => {
  const book = await BookRepository.softDeleteBook(userId, bookId);

  if (!book) {
    throw new NotFoundError(BOOK_MESSAGES.NOT_FOUND);
  }

  await BookRepository.softDeleteEntriesByBook(userId, bookId);
};
