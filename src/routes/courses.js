const express = require("express");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify,
    studentExistsVerify,
    userEnrolledVerify,
} = require("../middleware/courseverify");
const { Student, Instructor } = require("../models/user");
const { Course } = require("../models/course");
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

    const user = await Instructor.findById(res.locals.userId);
    user.courses.push(course);
    await user.save();

    res.status(200).send({ message: "Course created" });
});

router.delete(
    "/:id",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        logger.info(`Deleting course ${req.params.id}`);

        let course = res.locals.course;

        await course.remove();

        res.status(200).send({ message: "Course deleted" });
    }
);

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

module.exports = router;
