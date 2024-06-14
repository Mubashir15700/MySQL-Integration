import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts";
import AppError from "../utils/AppError.ts";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode: number;
    let message: string;

    // Check if the error is an instance of AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        // Default to 500 Internal Server Error for non-AppError errors
        statusCode = 500;
        message = err.message || "Internal Server Error";
    }

    // Log the error
    logger.error(`Error: ${message}, Status Code: ${statusCode}`);

    // Ensure response headers are sent
    if (res.headersSent) {
        return next(err);
    }

    // Respond with JSON error message
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};

export default errorHandler;
