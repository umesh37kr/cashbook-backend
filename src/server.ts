import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { logger } from "./common/logger/logger.js";

let server: any;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`Server running on ${env.PORT}`);
  });
};

startServer();

process.on("SIGINT", () => {
  logger.info("SIGINT received");

  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");

  server.close(() => {
    process.exit(0);
  });
});
