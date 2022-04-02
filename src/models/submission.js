const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    files: [{
        type: String
    }],
    grade: {
        type: Number,
        default: 0
    },
    comments: {
        type: String,
        default: ""
    }
});

module.exports = { submissionSchema };