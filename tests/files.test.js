const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");
const fs = require("fs");

const { Course } = require("../src/models/course");
const { Instructor } = require("../src/models/user");

describe("File operations", () => {
    let token = "";
    let courseId = "";

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

        fs.mkdirSync(
            `./files/uploads/courses/${courseId}/testdir`, { recursive: true });
        fs.writeFileSync(
            `./files/uploads/courses/${courseId}/test.txt`,
            "Test file"
        );

        fs.writeFileSync(
            `./files/uploads/courses/${courseId}/testdir/test.txt`,
            "Test file"
        );
    });

    afterAll(() => {
        fs.rmSync("./files/", { recursive: true });
    });

    it("Should get file structure from course", async () => {
        const response = await request(app)
            .get(`/api/files/course/${courseId}`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);

        expect(response.body[0].name).toBe("test.txt");
        expect(response.body[0].size).toBe(9);

        expect(response.body[1].name).toBe("testdir");

        expect(response.body[1].children[0].name).toBe("test.txt");
        expect(response.body[1].children[0].size).toBe(9);
    });
});