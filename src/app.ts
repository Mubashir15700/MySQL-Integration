import express, { Request, Response } from "express";
import {
    morganMiddleware,
    morganWinstonMiddleware,
} from "./middlewares/logging.ts";
import logger from "./utils/logger.ts";
import userRoutes from "./routes/userRoutes.ts";
import errorHandler from "./middlewares/errorHandler.ts";

const app = express();

const port = process.env.PORT;

app.use(express.json());

// Use morganMiddleware for HTTP request logging
app.use(morganMiddleware); // Logs to http.log using morgan and also to Winston logger
app.use(morganWinstonMiddleware); // Logs to Winston logger only

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript with Express!");
});

app.use("/api", userRoutes);

// Global error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
