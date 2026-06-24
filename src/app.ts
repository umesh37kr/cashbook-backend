import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(express.json());

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

app.use(globalErrorHandler);

export default app;
