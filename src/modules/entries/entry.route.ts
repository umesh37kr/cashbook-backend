import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import * as EntryController from "./entry.controller.js";
import {
  createEntrySchema,
  entryFilterSchema,
  updateEntrySchema,
} from "./entry.validation.js";

const router = Router();

router.use(authenticate);

router
  .route("/books/:bookId/entries")
  .get(validate(entryFilterSchema, "query"), EntryController.getEntries)
  .post(validate(createEntrySchema), EntryController.createEntry);

router
  .route("/books/:bookId/entries/:entryId")
  .get(EntryController.getEntryById)
  .patch(validate(updateEntrySchema), EntryController.updateEntry)
  .delete(EntryController.deleteEntry);

export default router;
