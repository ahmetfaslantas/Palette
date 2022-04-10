const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passHash: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
        default: "No bio yet.",
    },
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
});

const Student = mongoose.model("Student", userSchema);
const Instructor = mongoose.model("Instructor", userSchema);

module.exports = { Student, Instructor, userSchema };
