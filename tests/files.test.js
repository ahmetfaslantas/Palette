const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");
const fs = require("fs");

const { Course } = require("../src/models/course");
const { Instructor } = require("../src/models/user");

describe("File operations", () => {
    let token = "";
    let token2 = "";
    let courseId = "";
    let courseId2 = "";

    beforeAll(async () => {
        await Course.deleteMany({});
        await Instructor.deleteMany({});

        await request(app).post("/api/auth/signup").send({
            email: "test",
            password: "test",
            name: "Test Instructor",
            type: "instructor",
        });

        await request(app).post("/api/auth/signup").send({
            email: "test2",
            password: "test2",
            name: "Test Instructor",
            type: "instructor",
        });

        const loginResponse = await request(app).post("/api/auth/login").send({
            email: "test",
            password: "test",
            type: "instructor",
        });

        token = loginResponse.headers["set-cookie"];

        const loginResponse2 = await request(app).post("/api/auth/login").send({
            email: "test2",
            password: "test2",
            type: "instructor",
        });

        token2 = loginResponse2.headers["set-cookie"];

        await request(app)
            .post("/api/course/newcourse")
            .set("Cookie", token)
            .send({
                name: "Test Course",
                description: "Test Description",
            });

        await request(app)
            .post("/api/course/newcourse")
            .set("Cookie", token2)
            .send({
                name: "Test Course",
                description: "Test Description",
            });

        const courseIdResponse = await request(app)
            .get("/api/course")
            .set("Cookie", token)
            .send();

        courseId = courseIdResponse.body[0]._id;

        const courseId2Response = await request(app)
            .get("/api/course")
            .set("Cookie", token2)
            .send();

        courseId2 = courseId2Response.body[0]._id;

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

        fs.mkdirSync(
            `./files/uploads/courses/${courseId2}/testdir`, { recursive: true });
        
        fs.writeFileSync(
            `./files/uploads/courses/${courseId2}/test.txt`,
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
        expect(response.body.length).toBe(1);

        expect(response.body[0].children[0].name).toBe("test.txt");
        expect(response.body[0].children[0].size).toBe(9);

        expect(response.body[0].children[1].name).toBe("testdir");

        expect(response.body[0].children[1].children[0].name).toBe("test.txt");
        expect(response.body[0].children[1].children[0].size).toBe(9);
    });

    it("Should get file from course", async () => {
        const response = await request(app)
            .get(`/api/files/course/${courseId}/test.txt`)
            .set("Cookie", token)
            .responseType("blob")
            .send();

        expect(response.status).toBe(200);
        expect(response.body.toString()).toBe("Test file");
    });

    it("Should get file from course in subdirectory", async () => {
        const response = await request(app)
            .get(`/api/files/course/${courseId}/testdir/test.txt`)
            .set("Cookie", token)
            .responseType("blob")
            .send();

        expect(response.status).toBe(200);
        expect(response.body.toString()).toBe("Test file");
    });
    
    it("Should return 404 if file not found", async () => {
        const response = await request(app)
            .get(`/api/files/course/${courseId}/testdir/test2.txt`)
            .set("Cookie", token)
            .responseType("blob")
            .send();

        expect(response.status).toBe(404);
    });

    it("Should return 400 when trying to access file outside of course",
        async () => {
            const response = await request(app)
                .get(`/api/files/course/${courseId2}/../${courseId}/test.txt`)
                .set("Cookie", token)
                .responseType("blob")
                .send();

            expect(response.status).toBe(400);
        });
});
