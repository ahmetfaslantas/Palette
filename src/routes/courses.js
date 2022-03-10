const express = require("express");
const { authVerify } = require("../middleware/authverify");
const { courseExistsVerify, instructorVerify, studentExistsVerify, userEnrolledVerify } = require("../middleware/courseverify");
const { Student, Instructor } = require("../models/user");
const { Course } = require("../models/course");

const router = express.Router();

router.get("/", authVerify, async (req, res) => {
    const SelectedType = res.locals.role === "student" ? Student : Instructor;

    const user = await SelectedType.findById(res.locals.userId);

    let ids = [];
    for (let i = 0; i < user.courses.length; i++) {
        ids.push(user.courses[i]._id);
    }

    const courses = await Course.find({ _id: { $in: ids } });

    res.send(courses);
});

router.post("/newcourse", [authVerify, instructorVerify], async (req, res) => {
    const { name, description } = req.body;

    const course = await Course.create({ name: name, description: description, instructors: [res.locals.userId] });
    await course.save();

    const user = await Instructor.findById(res.locals.userId);
    user.courses.push(course);
    await user.save();

    res.status(200).send({ message: "Course created" });
});

router.post("/:id/announcement", [authVerify, instructorVerify, courseExistsVerify], async (req, res) => {
    const { title, content, files } = req.body;

    let course = res.locals.course;

    course.announcements.push({ title: title, content: content, files: files });
    await course.save();

    res.status(200).send({ message: "Announcement created" });
});

router.post("/:id/assignment", [authVerify, instructorVerify, courseExistsVerify], async (req, res) => {
    const { name, description, dueDate, files } = req.body;

    let course = res.locals.course;

    course.assignments.push({ name: name, description: description, dueDate: dueDate, files: files });
    await course.save();

    res.status(200).send({ message: "Assignment created" });
});

router.post("/:id/student", [authVerify, instructorVerify, courseExistsVerify], async (req, res) => {
    const { email } = req.body;

    const student = await Student.findOne({ email: email });

    if (!student) {
        return res.status(400).send({ error: "Student not found" });
    }

    if (student.courses.find(course => course.toString() === req.params.id)) {
        return res.status(400).send({ error: "Student already enrolled in course" });
    }

    let course = res.locals.course;

    course.students.push(student);
    student.courses.push(course);
    await course.save();
    await student.save();

    res.status(200).send({ message: "Student added" });
});

router.get("/:id/assignment", [authVerify, courseExistsVerify, userEnrolledVerify], async (req, res) => {
    let course = res.locals.course;

    res.send(course.assignments);
});

router.get("/:id/announcement", [authVerify, courseExistsVerify, userEnrolledVerify], async (req, res) => {
    let course = res.locals.course;

    res.send(course.announcements);
});

router.get("/:id/student", [authVerify, courseExistsVerify, userEnrolledVerify], async (req, res) => {
    let course = res.locals.course;

    const students = await Student.find({ _id: { $in: course.students } }, "-passHash");

    res.send(students);
});

router.delete("/:id/student", [authVerify, instructorVerify, courseExistsVerify, studentExistsVerify], async (req, res) => {
    let course = res.locals.course;
    let student = res.locals.student;

    course.students = course.students.filter(id => id.toString() !== req.body.studentId);
    student.courses = student.courses.filter(id => id.toString() !== req.params.id);
    await course.save();
    await student.save();
    
    res.status(200).send({ message: "Student removed" });
});

router.delete("/:id/assignment", [authVerify, instructorVerify, courseExistsVerify], async (req, res) => {
    let course = res.locals.course;

    if (!course.assignments.find(assignment => assignment._id.toString() === req.body.assignmentId)) {
        return res.status(400).send({ error: "Assignment not found" });
    }

    course.assignments = course.assignments.filter(assignment => assignment._id.toString() !== req.body.assignmentId);
    await course.save();

    res.status(200).send({ message: "Assignment removed" });
});

router.delete("/:id/announcement", [authVerify, instructorVerify, courseExistsVerify], async (req, res) => {
    let course = res.locals.course;
    
    if (!course.announcements.find(announcement => announcement._id.toString() === req.body.announcementId)) {
        return res.status(400).send({ error: "Announcement not found" });
    }

    course.announcements = course.announcements.filter(announcement => announcement._id.toString() !== req.body.announcementId);
    await course.save();

    res.status(200).send({ message: "Announcement removed" });
});

router.get("/:id/assignment/:assignmentId", [authVerify, courseExistsVerify, userEnrolledVerify], async (req, res) => {
    let course = res.locals.course;

    if (!course.assignments.find(assignment => assignment._id.toString() === req.params.assignmentId)) {
        return res.status(400).send({ error: "Assignment not found" });
    }

    const assignment = course.assignments.find(assignment => assignment._id.toString() === req.params.assignmentId);

    res.send(assignment);
});

router.get("/:id/announcement/:announcementId", [authVerify, courseExistsVerify, userEnrolledVerify], async (req, res) => {
    let course = res.locals.course;

    if (!course.announcements.find(announcement => announcement._id.toString() === req.params.announcementId)) {
        return res.status(400).send({ error: "Announcement not found" });
    }

    const announcement = course.announcements.find(announcement => announcement._id.toString() === req.params.announcementId);

    res.send(announcement);
});

module.exports = router;