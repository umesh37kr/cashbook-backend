import {
  BadRequestError,
  UnauthorizedError,
} from "../../common/errors/AppError.js";
import { sendResponse } from "../../common/responses/sendResponse.js";
import { catchAsync } from "../../common/utils/catchAsync.js";
import { ENTRY_MESSAGES } from "./entry.constants.js";
import * as EntryService from "./entry.service.js";
import type { EntryFilters } from "./entry.types.js";

const getUserId = (user?: Express.Request["user"]): string => {
  if (!user) {
    throw new UnauthorizedError("Authentication required");
  }

  return user.sub;
};

const getParam = (
  param: string | string[] | undefined,
  name: string,
): string => {
  if (typeof param !== "string") {
    throw new BadRequestError(`${name} is required`);
  }

  return param;
};

export const createEntry = catchAsync(async (req, res) => {
  const result = await EntryService.createEntry(
    getUserId(req.user),
    getParam(req.params.bookId, "bookId"),
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: ENTRY_MESSAGES.CREATED,
    data: result,
  });
});

export const getEntries = catchAsync(async (req, res) => {
  const result = await EntryService.getEntries(
    getUserId(req.user),
    getParam(req.params.bookId, "bookId"),
    req.query as unknown as EntryFilters,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: ENTRY_MESSAGES.LIST,
    data: result,
  });
});

export const getEntryById = catchAsync(async (req, res) => {
  const result = await EntryService.getEntryById(
    getUserId(req.user),
    getParam(req.params.bookId, "bookId"),
    getParam(req.params.entryId, "entryId"),
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: ENTRY_MESSAGES.DETAIL,
    data: result,
  });
});

export const updateEntry = catchAsync(async (req, res) => {
  const result = await EntryService.updateEntry(
    getUserId(req.user),
    getParam(req.params.bookId, "bookId"),
    getParam(req.params.entryId, "entryId"),
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: ENTRY_MESSAGES.UPDATED,
    data: result,
  });
});

export const deleteEntry = catchAsync(async (req, res) => {
  await EntryService.deleteEntry(
    getUserId(req.user),
    getParam(req.params.bookId, "bookId"),
    getParam(req.params.entryId, "entryId"),
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: ENTRY_MESSAGES.DELETED,
  });
});
