import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../common/logger/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info("MongoDB Connected");

    mongoose.connection.on("disconnected", () => {
      logger.error("MongoDB Disconnected");
    });

    mongoose.connection.on("error", (error) => {
      logger.error(error);
    });
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
};
