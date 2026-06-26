import { Router } from "express";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import * as BookController from "./book.controller.js";
import { createBookSchema, updateBookSchema } from "./book.validation.js";

const router = Router();

router.use(authenticate);

router
  .route("/")
  .get(BookController.getBooks)
  .post(validate(createBookSchema), BookController.createBook);

router
  .route("/:bookId")
  .get(BookController.getBookById)
  .patch(validate(updateBookSchema), BookController.updateBook)
  .delete(BookController.deleteBook);

export default router;
