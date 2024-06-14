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
        res.status(HttpStatusCode.CREATED).send(
            "Users table created successfully",
        );
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

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let connection;
    try {
        // Validate request body
        const { name, email } = req.body;
        if (!name || !email) {
            throw new AppError(
                "Name and email are required",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        // Acquire connection from the pool
        connection = await getConnection();

        // Insert user into the database
        const insertUserQuery = `
            INSERT INTO users (name, email)
            VALUES (?, ?)
        `;

        await connection.execute(insertUserQuery, [name, email]);
        res.status(HttpStatusCode.CREATED).send("User created successfully");
    } catch (error: any) {
        next(
            new AppError(
                error.message
                    ? `Error creating user: ${error.message}`
                    : "Error creating user",
                error.statusCode || HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError("User ID parameter is missing", HttpStatusCode.BAD_REQUEST);
    }

    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        // Execute query
        const [rows] = await connection.execute("SELECT * FROM users WHERE id = ?", [id]);

        // Check if no user found
        if (!(rows as RowDataPacket[]).length) {
            throw new AppError(`User with ID ${id} not found`, HttpStatusCode.NOT_FOUND);
        }

        res.status(HttpStatusCode.OK).json(rows);
    } catch (error: any) {
        next(
            new AppError(
                error.message
                    ? `Error fetching user: ${error.message}`
                    : "Error fetching user",
                error.statusCode || HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id) {
        throw new AppError("User ID parameter is missing", HttpStatusCode.BAD_REQUEST);
    }

    if (!name || !email) {
        throw new AppError("Name and email are required fields", HttpStatusCode.BAD_REQUEST);
    }

    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        // Execute update query
        const updateQuery = `
            UPDATE users
            SET name = ?, email = ?
            WHERE id = ?
        `;
        const [result] = await connection.execute(updateQuery, [name, email, id]);

        // Check if update was successful
        if ((result as any).affectedRows === 0) {
            throw new AppError(`User with ID ${id} not found`, HttpStatusCode.NOT_FOUND);
        }

        res.status(HttpStatusCode.OK).send("User updated successfully");
    } catch (error: any) {
        next(
            new AppError(
                error.message
                    ? `Error updating user: ${error.message}`
                    : "Error updating user",
                error.statusCode || HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const patchUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let connection;
    try {
        const { id } = req.params;

        if (!id) {
            throw new AppError("User ID parameter is missing", HttpStatusCode.BAD_REQUEST);
        }

        const { name, email } = req.body;

        if (!name && !email) {
            throw new AppError("At least one field (name or email) must be provided for update", HttpStatusCode.BAD_REQUEST);
        }

        // Acquire connection from the pool
        connection = await getConnection();

        // Prepare update query based on provided fields
        const updateFields = [];
        const queryParams = [];

        if (name) {
            updateFields.push("name = ?");
            queryParams.push(name);
        }

        if (email) {
            updateFields.push("email = ?");
            queryParams.push(email);
        }

        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(", ")}
            WHERE id = ?
        `;
        queryParams.push(id);

        // Execute update query
        const [result] = await connection.execute(updateQuery, queryParams);

        // Check if update was successful
        if ((result as any).affectedRows === 0) {
            throw new AppError(`User with ID ${id} not found`, HttpStatusCode.NOT_FOUND);
        }

        res.status(HttpStatusCode.OK).send("User updated successfully");
    } catch (error: any) {
        next(
            new AppError(
                error.message
                    ? `Error updating user: ${error.message}`
                    : `Error updating user with ID ${req.params.id}`,
                error.statusCode || HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;

    if (!id) {
        throw new AppError("User ID parameter is missing", HttpStatusCode.BAD_REQUEST);
    }

    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        // Execute delete query
        const deleteQuery = `
            DELETE FROM users
            WHERE id = ?
        `;
        const [result] = await connection.execute(deleteQuery, [id]);

        // Check if delete was successful
        if ((result as any).affectedRows === 0) {
            throw new AppError(`User with ID ${id} not found`, HttpStatusCode.NOT_FOUND);
        }

        res.status(HttpStatusCode.OK).send("User deleted successfully");
    } catch (error: any) {
        next(
            new AppError(
                error.message
                    ? `Error deleting user: ${error.message}`
                    : `Error deleting user with ID ${id}`,
                error.statusCode || HttpStatusCode.INTERNAL_SERVER,
            ),
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
