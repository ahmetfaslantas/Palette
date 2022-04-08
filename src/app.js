const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const filesRoutes = require("./routes/files");

const app = express();

mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

app.use(cors({
    credentials: true,
    origin: "http://localhost:8081"
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/files", filesRoutes);

module.exports = app;
