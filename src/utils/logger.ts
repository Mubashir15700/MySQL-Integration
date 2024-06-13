import winston from "winston";
import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "../../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
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
