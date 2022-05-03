const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const assignmentRoutes = require("./routes/assignments");
const announcementRoutes = require("./routes/announcements");
const filesRoutes = require("./routes/files");
const peopleRoutes = require("./routes/people");

const logger = require("./logger");

const app = express();

logger.info(`Connecting to database at ${process.env.DB}`);

mongoose
    .connect(process.env.DB, { useNewUrlParser: true })
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => logger.error(err));

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:8081",
    })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/course", assignmentRoutes);
app.use("/api/course", announcementRoutes);
app.use("/api/course", peopleRoutes);
app.use("/api/files", filesRoutes);

module.exports = app;
