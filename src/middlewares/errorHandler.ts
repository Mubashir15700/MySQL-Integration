import { Request, Response } from "express";
import logger from "../utils/logger.ts";

interface CustomError extends Error {
    statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    logger.error(`Error: ${message}, Status Code: ${statusCode}`);

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};

export default errorHandler;
