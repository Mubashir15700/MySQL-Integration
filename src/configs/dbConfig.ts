import mysql from "mysql2/promise";
import AppError from "@src/utils/AppError";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error: any) {
        throw new AppError(`Error connecting to MySQL: ${error.message}`, 500);
    }
};
