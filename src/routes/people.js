const express = require("express");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify,
    studentExistsVerify,
    userEnrolledVerify,
} = require("../middleware/courseverify");
const { Student, Instructor } = require("../models/user");
const logger = require("../logger");

const router = express.Router();

router.post(
    "/:id/student",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        const { email } = req.body;

        logger.info(`Adding student ${email} to course ${req.params.id}`);

        const student = await Student.findOne({ email: email });

        if (!student) {
            return res.status(400).send({ error: "Student not found" });
        }

        if (
            student.courses.find(
                (course) => course.toString() === req.params.id
            )
        ) {
            return res
                .status(400)
                .send({ error: "Student already enrolled in course" });
        }

        let course = res.locals.course;

        course.students.push(student);
        student.courses.push(course);

        await course.save();
        await student.save();

        res.status(200).send({ message: "Student added" });
    }
);

router.get(
    "/:id/student",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        let course = res.locals.course;

        const students = await Student.find(
            { _id: { $in: course.students } },
            "-passHash"
        );

        res.send(students);
    }
);

router.delete(
    "/:id/student",
    [authVerify, instructorVerify, courseExistsVerify, studentExistsVerify],
    async (req, res) => {
        logger.info(
            `Removing student ${req.body.studentId} from course ${req.params.id}`
        );

        let course = res.locals.course;
        let student = res.locals.student;

        course.students = course.students.filter(
            (id) => id.toString() !== req.body.studentId
        );
        student.courses = student.courses.filter(
            (id) => id.toString() !== req.params.id
        );
        await course.save();
        await student.save();

        res.status(200).send({ message: "Student removed" });
    }
);

router.get(
    "/:id/instructor",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        logger.info(`Getting instructors for course ${req.params.id}`);

        let course = res.locals.course;

        const instructors = await Instructor.find(
            { _id: { $in: course.instructors } },
            "-passHash"
        );

        res.status(200).send(instructors);
    }
);

module.exports = router;