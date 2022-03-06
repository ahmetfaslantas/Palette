const bcrypt = require("bcrypt");
const express = require("express");
const { Student, Instructor } = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password, type } = req.body;
    const passHash = bcrypt.hashSync(password, 12);

    const SelectedType = type === "student" ? Student : Instructor;

    const user = await SelectedType.findOne({ email: email });

    if (user) {
        return res.status(400).send({ error: "User already exists" });
    }

    await SelectedType.create({ name, email, passHash });
    
    res.redirect("/");
});

router.post("/login", async (req, res) => {
    const { email, password, type } = req.body;

    const SelectedType = type === "student" ? Student : Instructor;

    const user = await SelectedType.findOne({ email: email });

    if (!user) {
        return res.status(400).send({ error: "User not found" });
    }

    const passMatch = bcrypt.compareSync(password, user.passHash);

    if (!passMatch) {
        return res.json({ error: "Password incorrect" });
    }

    res.redirect("/");
});

module.exports = router;