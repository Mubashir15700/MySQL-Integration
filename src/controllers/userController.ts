import { Request, Response } from "express";
import { getConnection } from "../configs/dbConfig.ts";
import logger from "../utils/logger.ts";

export const createUsersTable = async (req: Request, res: Response) => {
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
        res.status(200).send('Users table created successfully');
    } catch (error: any) {
        logger.error(`Error creating users table: ${error.message}`);
        res.status(500).json({ error: 'Error creating users table' });
    } finally {
        // Always release connection back to the pool
        if (connection) {
            connection.release(); // Release the connection
        }
    }
};

export const getUsers = async (req: Request, res: Response) => {
    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        // Execute query
        const [rows, fields] = await connection.execute("SELECT * FROM users");

        res.status(200).json(rows);
    } catch (error: any) {
        logger.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ error: "Error fetching users" });
    } finally {
        // Always release connection back to the pool
        if (connection) {
            connection.release(); // Release the connection
        }
    }
};
