import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import morgan from "morgan";
import logger from "../utils/logger.ts";

// Get the current file's path and convert it to a directory path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

// Navigate back two levels and then enter the "logs" directory
const logsDirPath = join(currentDirPath, "../../logs");

// Create a write stream (in append mode) for HTTP logs
const accessLogStream = fs.createWriteStream(
    path.join(logsDirPath, "http.log"),
    { flags: "a" },
);

// Define stream options for Morgan
const streamOptions: morgan.Options<Request, Response> = {
    stream: accessLogStream,
};

// Export Morgan middleware with combined format
export const morganMiddleware = morgan("combined", streamOptions);

// Optionally, log to Winston as well
export const morganWinstonMiddleware = morgan("combined", {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
});
