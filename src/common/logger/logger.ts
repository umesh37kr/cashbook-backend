import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { env } from "../../config/env.js";

const logDirectory = path.join(process.cwd(), "logs");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
});

const combinedFileTransport = new DailyRotateFile({
  dirname: logDirectory,

  filename: "combined-%DATE%.log",

  datePattern: "YYYY-MM-DD",

  maxFiles: "30d",
});

const errorFileTransport = new DailyRotateFile({
  dirname: logDirectory,

  filename: "error-%DATE%.log",

  level: "error",

  datePattern: "YYYY-MM-DD",

  maxFiles: "60d",
});

export const logger = winston.createLogger({
  level: env.LOGGER.LEVEL,

  format: winston.format.combine(
    winston.format.timestamp(),

    winston.format.errors({
      stack: true,
    }),

    winston.format.json(),
  ),

  transports: [consoleTransport, combinedFileTransport, errorFileTransport],
});
