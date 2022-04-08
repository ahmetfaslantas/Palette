const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");

const { Student, Instructor } = require("../src/models/user");

describe("Sign up", () => {

    beforeAll(async () => {
        await Student.deleteMany({});
        await Instructor.deleteMany({});
    });

    it("Should create a new instructor", async () => {
        const response = await request(app).post("/api/auth/signup").send({
            email: "test",
            password: "test",
            type: "instuctor",
            name: "John Doe"
        });

        expect(response.status).toBe(200);
    });

    it("Should not create a new user with the same email", async () => {
        const response = await request(app).post("/api/auth/signup").send({
            email: "test",
            password: "test",
            type: "instuctor",
            name: "John Doe"
        });

        expect(response.status).toBe(400);
    });

    it("Login should return a token", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "test",
            password: "test"
        });

        expect(response.status).toBe(200);
        expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("Login should return an error if the user is not found", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "test2",
            password: "test"
        });

        expect(response.status).toBe(400);
    });

    it("Login should return an error if the password is incorrect", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "test",
            password: "test2"
        });

        expect(response.status).toBe(400);
    });

    it("Should create a new student", async () => {
        const response = await request(app).post("/api/auth/signup").send({
            email: "student",
            password: "student",
            type: "student",
            name: "John Doe the Student"
        });

        expect(response.status).toBe(200);
    });

    it("Should not login with valid credentials but with wrong type", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "student",
            password: "student",
            type: "instuctor"
        });

        expect(response.status).toBe(400);
    });
});