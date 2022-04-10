const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { assignmentSchema } = require("./assignment");
const { announcementSchema } = require("./announcement");

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    assignments: [
        {
            type: assignmentSchema,
        },
    ],
    announcements: [
        {
            type: announcementSchema,
        },
    ],
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
    instructors: [
        {
            type: Schema.Types.ObjectId,
            ref: "Instructor",
        },
    ],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = { Course, courseSchema };
