import { Request, Response, NextFunction } from "express";
import { getConnection } from "../configs/dbConfig.ts";
import AppError from "@src/utils/AppError.ts";

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
        res.status(200).send("Users table created successfully");
    } catch (error: any) {
        next(new AppError(`Error creating users table: ${error.message}`, 500));
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

        res.status(200).json(rows);
    } catch (error: any) {
        next(new AppError(`Error fetching users: ${error.message}`, 500));
    } finally {
        // Always release connection back to the pool
        if (connection) {
            connection.release(); // Release the connection
        }
    }
};
