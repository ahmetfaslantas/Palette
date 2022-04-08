const { Student, Instructor } = require("../models/user");
const { Course } = require("../models/course");

exports.instructorVerify = (req, res, next) => {
    if (res.locals.role === "student") {
        return res.status(401).send({ error: "Students cannot remove assignments" });
    } else {
        next();
    }
};

exports.courseExistsVerify = async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return res.status(400).send({ error: "Course not found" });
    }

    res.locals.course = course;

    next();
};

exports.studentExistsVerify = async (req, res, next) => {
    const student = await Student.findById(req.body.studentId);

    if (!student) {
        return res.status(400).send({ error: "Student not found" });
    }

    res.locals.student = student;

    next();
};

exports.userEnrolledVerify = async (req, res, next) => {
    const SelectedType = res.locals.role === "student" ? Student : Instructor;

    const user = await SelectedType.find({ _id: res.locals.userId, courses: req.params.id });

    if (!user) {
        return res.status(400).send({ error: "This user does not exist" });
    }

    res.locals.user = user[0];

    next();
};