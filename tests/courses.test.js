const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");

const { Course } = require("../src/models/course");
const { Instructor, Student } = require("../src/models/user");

describe("Course operations", () => {
    let instructorToken = "";
    let studentToken = "";
    let courseId = "";

    beforeAll(async () => {
        await Course.deleteMany({});
        await Instructor.deleteMany({});
        await Student.deleteMany({});

        await request(app).post("/api/auth/signup").send({
            email: "test",
            password: "test",
            name: "Test Instructor",
            type: "instructor",
        });

        await request(app).post("/api/auth/signup").send({
            email: "test2",
            password: "test2",
            name: "Test Student",
            type: "student",
        });

        const instructorLoginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test",
                password: "test",
                type: "instructor",
            });

        const studentLoginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test2",
                password: "test2",
                type: "student",
            });

        instructorToken = instructorLoginResponse.headers["set-cookie"];
        studentToken = studentLoginResponse.headers["set-cookie"];
    });

    it("Should create a new course (instructor)", async () => {
        const response = await request(app)
            .post("/api/course/newcourse")
            .set("Cookie", instructorToken)
            .send({
                name: "Test Course",
                description: "Test Description",
            });

        expect(response.status).toBe(200);
    });

    it("Should not create a new course (student)", async () => {
        const response = await request(app)
            .post("/api/course/newcourse")
            .set("Cookie", studentToken)
            .send({
                name: "Test Course",
                description: "Test Description",
            });

        expect(response.status).toBe(401);
    });

    it("Should get all courses", async () => {
        const response = await request(app)
            .get("/api/course")
            .set("Cookie", instructorToken)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);

        const course = response.body[0];

        expect(course._id).toBeDefined();

        courseId = course._id;

        expect(course.name).toBe("Test Course");
        expect(course.description).toBe("Test Description");
        expect(course.creationDate).toBeDefined();
    });

    it("Should invite a student to a course (instructor)", async () => {
        const response = await request(app)
            .post(`/api/course/${courseId}/student`)
            .set("Cookie", instructorToken)
            .send({
                email: "test2",
            });

        expect(response.status).toBe(200);
    });

    it("Should not be able to add student to a non-existent course", async () => {
        const response = await request(app)
            .post("/api/course/624ff896dec980f6960e8e81/student")
            .set("Cookie", instructorToken)
            .send({
                email: "test2",
            });

        expect(response.status).toBe(400);
    });

    it("Should not invite a student to a course (student)", async () => {
        const response = await request(app)
            .post(`/api/course/${courseId}/student`)
            .set("Cookie", studentToken)
            .send({
                email: "test2",
            });

        expect(response.status).toBe(401);
    });

    it("Should get all students enrolled in a course", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/student`)
            .set("Cookie", instructorToken)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);

        const student = response.body[0];

        expect(student.email).toBe("test2");
        expect(student.name).toBe("Test Student");
    });

    it("Should delete a course (instructor)", async () => {
        const response = await request(app)
            .delete(`/api/course/${courseId}`)
            .set("Cookie", instructorToken)
            .send();

        expect(response.status).toBe(200);
    });

    it("Should not delete a course (student)", async () => {
        const response = await request(app)
            .delete(`/api/course/${courseId}`)
            .set("Cookie", studentToken)
            .send();

        expect(response.status).toBe(401);
    });
});
