import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import { getConnection } from "../configs/dbConfig.ts";
import AppError from "../utils/AppError.ts";
import { HttpStatusCode } from "../constants/httpStatusCodes.ts";

export const createUsersTable = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createTableQuery);
        res.status(HttpStatusCode.OK).send("Users table created successfully");
    } catch (error: any) {
        next(
            new AppError(
                `Error creating users table: ${error.message}`,
                HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        // Always release connection back to the pool
        if (connection) {
            connection.release(); // Release the connection
        }
    }
};

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        // Execute query
        const [rows] = await connection.execute("SELECT * FROM users");

        // Check if no users found
        if (!(rows as RowDataPacket[]).length) {
            throw new AppError("No users found", HttpStatusCode.NOT_FOUND);
        }

        res.status(HttpStatusCode.OK).json(rows);
    } catch (error: any) {
        next(
            new AppError(
                error.message
                    ? `Error fetching users: ${error.message}`
                    : "Error fetching users",
                error.statusCode || HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
