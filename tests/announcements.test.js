const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");

const { Course } = require("../src/models/course");
const { Instructor } = require("../src/models/user");

describe("Announcements operations", () => {
    let token = "";
    let courseId = "";
    let announcementId = "";

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
    });

    it("Should post an announcement", async () => {
        const response = await request(app)
            .post(`/api/course/${courseId}/announcement`)
            .set("Cookie", token)
            .send({
                title: "Test Announcement",
                content: "Test Content",
                files: [],
            });

        expect(response.status).toBe(200);
    });

    it("Should get all announcements", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/announcement`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);

        const announcement = response.body[0];

        expect(announcement._id).toBeDefined();
        announcementId = announcement._id;
        expect(announcement.title).toBe("Test Announcement");
        expect(announcement.content).toBe("Test Content");
        expect(announcement.date).toBeDefined();
        expect(announcement.publisher).toBeDefined();
    });

    it("Should post a comment", async () => {
        const response = await request(app)
            .post(`/api/course/${courseId}/announcement/${announcementId}/comment`)
            .set("Cookie", token)
            .send({
                content: "Test Comment",
            });

        expect(response.status).toBe(200);
    });

    it("Should get an announcement", async () => {
        const response = await request(app)
            .get(`/api/course/${courseId}/announcement/${announcementId}`)
            .set("Cookie", token)
            .send();

        expect(response.status).toBe(200);

        const announcement = response.body;

        expect(announcement._id).toBeDefined();
        expect(announcement.title).toBe("Test Announcement");
        expect(announcement.content).toBe("Test Content");
        expect(announcement.date).toBeDefined();
        expect(announcement.files.length).toBe(0);
        expect(announcement.publisher).toBeDefined();
        expect(announcement.comments.length).toBe(1);
    });
});
