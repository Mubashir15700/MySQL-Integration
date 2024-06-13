import express, { Request, Response } from "express";
import winston from "winston";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT;

app.use(express.json());

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

// Define log file path for HTTP requests
const httpLogFilePath = "./logs/http.log";
const accessLogStream = fs.createWriteStream(path.join(__dirname, httpLogFilePath), { flags: "a" });

// Set up Morgan middleware to log HTTP requests
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
