const express = require("express");
const fs = require("fs");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify,
    userEnrolledVerify,
} = require("../middleware/courseverify");
const logger = require("../logger");

const router = express.Router();

router.post(
    "/:id/assignment",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        const { name, description, dueDate, files } = req.body;

        logger.info(
            `Creating new assignment ${name} for course ${req.params.id}`
        );

        let course = res.locals.course;

        course.assignments.push({
            name: name,
            description: description,
            dueDate: dueDate,
            files: files,
        });
        await course.save();

        res.status(200).send({ message: "Assignment created" });
    }
);

router.get(
    "/:id/assignment",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        let course = res.locals.course;

        let assignments = [];
        course.assignments.forEach((assignment) => {
            assignments.push({
                _id: assignment._id,
                name: assignment.name,
                description: assignment.description,
                dueDate: assignment.dueDate,
                files: assignment.files,
                submissions: assignment.submissions.filter(
                    (submission) =>
                        submission.studentId.toString() ===
                        res.locals.userId.toString()
                ),
            });
        });

        res.send(assignments);
    }
);

router.delete(
    "/:id/assignment",
    [authVerify, instructorVerify, courseExistsVerify],
    async (req, res) => {
        let course = res.locals.course;

        logger.info(
            `Deleting assignment ${req.body.assignmentId} ` +
                `for course ${req.params.id}`
        );

        if (
            !course.assignments.find(
                (assignment) =>
                    assignment._id.toString() === req.body.assignmentId
            )
        ) {
            return res.status(400).send({ error: "Assignment not found" });
        }

        course.assignments = course.assignments.filter(
            (assignment) => assignment._id.toString() !== req.body.assignmentId
        );
        await course.save();

        res.status(200).send({ message: "Assignment removed" });
    }
);

router.get(
    "/:id/assignment/:assignmentId",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        let course = res.locals.course;

        if (
            !course.assignments.find(
                (assignment) =>
                    assignment._id.toString() === req.params.assignmentId
            )
        ) {
            return res.status(400).send({ error: "Assignment not found" });
        }

        const assignment = course.assignments.find(
            (assignment) =>
                assignment._id.toString() === req.params.assignmentId
        );

        res.send(assignment);
    }
);

router.post(
    "/:id/assignment/:assignmentId/submit",
    [authVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        logger.info(
            `Submitting assignment ${req.params.assignmentId} for course ` +
                `${req.params.id} by user ${res.locals.userId}`
        );

        const { files } = req.body;

        files.forEach((file) => {
            if (
                !fs.existsSync(
                    `${process.env.UPLOAD_ROOT}/uploads/students/` +
                        `${res.locals.userId}/${file}`
                )
            ) {
                return res.status(400).send({ error: "File not found" });
            }
        });

        let course = res.locals.course;
        let assignment = course.assignments.find(
            (assignment) =>
                assignment._id.toString() === req.params.assignmentId
        );

        assignment.submissions.push({
            studentId: res.locals.userId,
            files: files,
        });

        await course.save();

        res.status(200).send({ message: "Assignment submitted" });
    }
);

module.exports = router;
