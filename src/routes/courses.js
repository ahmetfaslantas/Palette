const express = require("express");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify,
    userEnrolledVerify,
} = require("../middleware/courseverify");
const { Student, Instructor } = require("../models/user");
const { Course } = require("../models/course");
const fs = require("fs");
const logger = require("../logger");

const router = express.Router();

router.get("/", authVerify, async (req, res) => {
    const SelectedType = res.locals.role === "student" ? Student : Instructor;

    const user = await SelectedType.findById(res.locals.userId);

    const courses = await Course.find({ _id: { $in: user.courses } }, [
        "-announcements",
        "-assignments",
        "-students",
        "-instructors",
        "-submissions",
        "-__v",
    ]);

    res.send(courses);
});

router.post("/newcourse", [authVerify, instructorVerify], async (req, res) => {
    const { name, description } = req.body;

    logger.info(`Creating new course ${name}`);

    const course = await Course.create({
        name: name,
        description: description,
        instructors: [res.locals.userId],
    });

    await course.save();

    fs.mkdirSync(`${process.env.UPLOAD_ROOT}/uploads/courses/${course._id}`, {
        recursive: true,
    });

    const user = await Instructor.findById(res.locals.userId);
    user.courses.push(course);
    await user.save();

    res.status(200).send({ message: "Course created" });
});

router.get(
    "/:id",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        logger.info(`Getting course summary for id ${req.params.id}`);

        const course = res.locals.course;

        const nearAssignments = await course.assignments.filter(
            (assignment) => assignment.dueDate < Date.now() + 86400000 * 7 &&
                assignment.dueDate > Date.now()
        );

        let doneAssignments = nearAssignments.filter(
            (assignment) => assignment.submissions.find(
                (submission) => submission.studentId.toString() === res.locals.userId
            ) !== undefined
        );

        doneAssignments = doneAssignments.map((assignment) => {
            return {
                _id: assignment._id,
                name: assignment.name,
                description: assignment.description,
                dueDate: assignment.dueDate,
                maxPoints: assignment.maxPoints,
            };
        });

        let upcomingAssignments = await nearAssignments.filter(
            (assignment) => assignment.submissions.find(
                (submission) => submission.studentId.toString() === res.locals.userId
            ) === undefined
        );

        upcomingAssignments = upcomingAssignments.map((assignment) => {
            return {
                _id: assignment._id,
                name: assignment.name,
                description: assignment.description,
                dueDate: assignment.dueDate,
                maxPoints: assignment.maxPoints,
            };
        });

        const newAnnouncements = await course.announcements.filter(
            (announcement) => announcement.date < Date.now() + 86400000 * 7
        );

        const result = {
            doneAssignments: doneAssignments,
            upcomingAssignments: upcomingAssignments,
            newAnnouncements: newAnnouncements,
        };

        res.status(200).send(result);
    }
);

router.delete(
    "/:id",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        logger.info(`Deleting course ${req.params.id}`);

        const course = res.locals.course;

        await course.remove();

        res.status(200).send({ message: "Course deleted" });
    }
);

module.exports = router;
