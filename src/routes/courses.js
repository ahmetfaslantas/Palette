const express = require("express");
const { authVerify } = require("../middleware/authverify");
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

router.post("/newcourse", authVerify, async (req, res) => {
    if (res.locals.role === "student") {
        return res.status(400).send({ error: "Students cannot create courses" });
    }

    const { name, description } = req.body;

    const course = await Course.create({ name: name, description: description, instructors: [res.locals.userId] });
    await course.save();

    const user = await Instructor.findById(res.locals.userId);
    user.courses.push(course);
    await user.save();

    res.status(200).send({ message: "Course created" });
});

module.exports = router;