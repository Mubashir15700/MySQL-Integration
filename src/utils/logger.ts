import winston from "winston";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current file's path and convert it to a directory path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);

// Navigate back two levels and then enter the "logs" directory
const logsDirPath = join(currentDirPath, "../../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDirPath)) {
    fs.mkdirSync(logsDirPath);
}

// Define log file paths
const errorLogFilePath = "./logs/error.log";
const warnLogFilePath = "./logs/warn.log";
const infoLogFilePath = "./logs/info.log";

// Configure Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: errorLogFilePath, level: "error" }),
        new winston.transports.File({ filename: warnLogFilePath, level: "warn" }),
        new winston.transports.File({ filename: infoLogFilePath, level: "info" }),
    ],
});

// Optionally, add a console transport for development/debugging
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger;
