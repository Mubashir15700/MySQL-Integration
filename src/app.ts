import express, { Request, Response } from "express";
import { getConnection } from "./db.ts";
import { morganMiddleware, morganWinstonMiddleware } from "./middlewares/logging.ts";
import logger from "./utils/logger.ts";

const app = express();

const port = process.env.PORT;

app.use(express.json());

// Use morganMiddleware for HTTP request logging
app.use(morganMiddleware); // Logs to http.log using morgan and also to Winston logger
app.use(morganWinstonMiddleware); // Logs to Winston logger only

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});

// Example endpoint to fetch data from database
app.get("/users", async (req: Request, res: Response) => {
    let connection;
    try {
        // Acquire connection from the pool
        connection = await getConnection();

        // Execute query
        const [rows, fields] = await connection.execute("SELECT * FROM users");

        // Respond with data
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
});

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
