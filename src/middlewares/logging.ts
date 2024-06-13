import { Request, Response } from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import logger from "../utils/logger";

const logDir = path.join(__dirname, "../../logs");

// Create a write stream (in append mode) for HTTP logs
const accessLogStream = fs.createWriteStream(path.join(logDir, "http.log"), { flags: "a" });

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
