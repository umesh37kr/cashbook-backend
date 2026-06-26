import { Router } from "express";

import authRoutes from "../modules/auth/auth.route.js";
import bookRoutes from "../modules/books/book.route.js";
import entryRoutes from "../modules/entries/entry.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/", entryRoutes);

export default router;
