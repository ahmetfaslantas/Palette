const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    publisher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    files: [
        {
            type: String,
        },
    ],
    comments: [
        {
            content: {
                type: String,
                required: true,
            },
            publisher: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = { announcementSchema };
