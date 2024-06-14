import AppError from "../src/utils/AppError";

describe("AppError class", () => {
    it("should create an instance with correct properties", () => {
        const error = new AppError("Test error message", 404);

        expect(error.message).toBe("Test error message");
        expect(error.statusCode).toBe(404);
    });

    it("should have 'Error' in its prototype chain", () => {
        const error = new AppError("Test error", 500);

        expect(error instanceof Error).toBeTruthy();
    });
});
