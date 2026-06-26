import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../common/logger/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.DATABASE.URI);

    // logger.info("MongoDB connected successfully.");
    logger.info({
      message: "MongoDB connected successfully.",
    });
    mongoose.connection.on("disconnected", () => {
      logger.warn({
        message: "MongoDB disconnected.",
      });
    });

    mongoose.connection.on("reconnected", () => {
      logger.info({
        message: "MongoDB reconnected.",
      });
    });

    mongoose.connection.on("error", (error) => {
      logger.error({
        message: "Error occurred while connecting to MongoDB.",
        error: error,
      });
    });
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
};
