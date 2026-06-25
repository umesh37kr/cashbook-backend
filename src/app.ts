import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { globalErrorHandler } from "./common/middlewares/error.middleware.js";
import routes from "./routes/index.js";

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

app.use("/api/v1", routes);

app.use(globalErrorHandler);

export default app;
