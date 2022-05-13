const express = require("express");
const fs = require("fs");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify,
    userEnrolledVerify,
} = require("../middleware/courseverify");
const logger = require("../logger");
const { Student, Instructor } = require("../models/user");

const router = express.Router();

router.post(
    "/:id/assignment",
    [authVerify, instructorVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        const { name, description, dueDate, files, maxPoints } = req.body;

        logger.info(
            `Creating new assignment ${name} for course ${req.params.id}`
        );

        let course = res.locals.course;

        course.assignments.push({
            name: name,
            description: description,
            dueDate: dueDate,
            files: files,
            maxPoints: maxPoints,
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
            });
        });

        res.send(assignments);
    }
);

router.delete(
    "/:id/assignment",
    [authVerify, instructorVerify, courseExistsVerify, userEnrolledVerify],
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
        const course = res.locals.course;
        const user = res.locals.user;

        let assignment = course.assignments.find(
            (assignment) =>
                assignment._id.toString() === req.params.assignmentId
        );
        
        if (!assignment) {
            return res.status(400).send({ error: "Assignment not found" });
        }

        assignment = {
            _id: assignment._id,
            name: assignment.name,
            description: assignment.description,
            dueDate: assignment.dueDate,
            files: assignment.files,
            maxPoints: assignment.maxPoints,
            submission: assignment.submissions.filter(
                (submission) => submission.studentId.toString() === user._id
            ),
        };

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

        if (!files) {
            return res.status(400).send({ error: "No files provided" });
        }

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

router.get(
    "/:id/assignment/:assignmentId/submissions",
    [authVerify, instructorVerify, courseExistsVerify, userEnrolledVerify],
    async (req, res) => {
        logger.info(
            `Getting submissions for assignment ${req.params.assignmentId} ` +
            `for course ${req.params.id}`
        );

        const course = res.locals.course;

        let assignment = course.assignments.find(
            (assignment) =>
                assignment._id.toString() === req.params.assignmentId
        );

        if (!assignment) {
            return res.status(400).send({ error: "Assignment not found" });
        }

        const submissions = await Promise.all(assignment.submissions.map(
            async (submission) => {
                let submitter = await Student.findById(submission.studentId);

                if (!submitter) {
                    submitter = await Instructor.findById(submission.studentId);
                }

                return {
                    _id: submission._id,
                    studentId: submission.studentId,
                    files: submission.files,
                    submitter: submitter.name,
                };
            }));

        res.status(200).send({
            submissions: submissions,
            maxPoints: assignment.maxPoints,
        });
    }
);

module.exports = router;
