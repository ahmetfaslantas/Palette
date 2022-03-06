const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});