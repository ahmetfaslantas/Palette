const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { submissionSchema } = require("./submission");

const assignmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    maxPoints: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    files: [
        {
            type: String,
        },
    ],
    submissions: [
        {
            type: submissionSchema,
        },
    ],
});

module.exports = { assignmentSchema };
