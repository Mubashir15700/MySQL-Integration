import request from "supertest";
import express, { Request, Response } from "express";

// Create a simple app for testing
const app = express();
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello, World!");
});

describe("GET /", () => {
    it("should return Hello, World!", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("Hello, World!");
    });
});
