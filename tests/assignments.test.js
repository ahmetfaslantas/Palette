const request = require("supertest");
const fs = require("fs");
require("dotenv").config();
const app = require("../src/app");

const { Course } = require("../src/models/course");
const { Instructor } = require("../src/models/user");

describe("Assignment operations", () => {
    let token = "";
    let courseId = "";
    let assignmentId = "";
    let userId = "";

    beforeAll(async () => {
        await Course.deleteMany({});
        await Instructor.deleteMany({});

        await request(app).post("/api/auth/signup").send({
            email: "test",
            password: "test",
            name: "Test Instructor",
            type: "instructor",
        });

        const loginResponse = await request(app).post("/api/auth/login").send({
            email: "test",
            password: "test",
            type: "instructor",
        });

        token = loginResponse.headers["set-cookie"];
        userId = loginResponse.body.id;

        await request(app)
            .post("/api/course/newcourse")
            .set("Cookie", token)
            .send({
                name: "Test Course",
                description: "Test Description",
            });

        const courseIdResponse = await request(app)
            .get("/api/course")
            .set("Cookie", token)
            .send();

        courseId = courseIdResponse.body[0]._id;
    });

    afterAll(() => {
        fs.rmSync("./files/", { recursive: true });
    });

    it("Should post a new assignment", async () => {
        const response = await request(app)
            .post(`/api/course/${courseId}/assignment`)
            .set("Cookie", token)
            .send({
                name: "Test Assignment",
                description: "Test Description",
                dueDate: new Date(),
                files: [],
                maxPoints: 100,
            });

        expect(response.status).toBe(200);
    });

    it("Should get all assignments", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/assignment`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);

        const assignment = response.body[0];

        expect(assignment._id).toBeDefined();
        assignmentId = assignment._id;
        expect(assignment.name).toBe("Test Assignment");
        expect(assignment.description).toBe("Test Description");
        expect(assignment.dueDate).toBeDefined();
    });

    it("Should get an assignment", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/assignment/${assignmentId}`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);

        const assignment = response.body;

        expect(assignment._id).toBeDefined();
        expect(assignment.name).toBe("Test Assignment");
        expect(assignment.description).toBe("Test Description");
        expect(assignment.dueDate).toBeDefined();
        expect(assignment.files.length).toBe(0);
        expect(assignment.maxPoints).toBe(100);
    });

    it("Should upload a file to the users storage", async () => {
        fs.writeFileSync("./test.txt", "Test File");

        const response = await request(app)
            .post("/api/files/user/upload")
            .set("Cookie", token)
            .attach("files", "./test.txt");

        fs.rmSync("./test.txt");

        expect(response.status).toBe(200);

        const file = response.body;
        expect(file.files.length).toBe(1);
        expect(file.files).toEqual(expect.arrayContaining(["test.txt"]));
    });

    it("Should rename if a file with the same name is uploaded", async () => {
        fs.writeFileSync("./test.txt", "Test File");

        const response = await request(app)
            .post("/api/files/user/upload")
            .set("Cookie", token)
            .attach("files", "./test.txt");

        fs.rmSync("./test.txt");

        expect(response.status).toBe(200);

        const file = response.body;
        expect(file.files.length).toBe(1);
        expect(file.files).toEqual(expect.arrayContaining(["test_1.txt"]));
    });

    it("Should submit a file to an assignment", async () => {
        const response = await request(app)
            .post(`/api/course/${courseId}/assignment/${assignmentId}/submit`)
            .set("Cookie", token)
            .send({
                files: ["test.txt"],
            });

        expect(response.status).toBe(200);
    });

    it("Should get all submissions for an assignment", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/assignment/${assignmentId}/submissions`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.submissions.length).toBe(1);
        expect(response.body.submissions[0].files.length).toBe(1);
        expect(response.body.maxPoints).toBe(100);
    });

    it("Should grade an assignment", async () => {
        const grades = {};
        grades[userId] = 100;

        const response = await request(app)
            .post(`/api/course/${courseId}/assignment/${assignmentId}/grade`)
            .set("Cookie", token)
            .send({ grades });

        expect(response.status).toBe(200);
    });

    it("Should get grade information for an assignment", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/assignment/${assignmentId}/grade`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.self).toBe(100);
        expect(response.body.average).toBe(100);
    });

    it("Should get all assignments' grade information", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/grades`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].self).toBe(100);
        expect(response.body[0].average).toBe(100);
        expect(response.body[0].max).toBe(100);
        expect(response.body[0].min).toBe(100);
        expect(response.body[0].id).toBeDefined();
        expect(response.body[0].name).toBe("Test Assignment");
    });
});
