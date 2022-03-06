const jwt = require("jsonwebtoken");
const { Student, Instructor } = require("../models/user");

exports.authVerify = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        res.locals.userId = decoded.id;
        res.locals.role = decoded.role;

        const SelectedType = decoded.role === "student" ? Student : Instructor;

        const user = await SelectedType.findById(res.locals.userId);

        if (!user) {
            return res.status(400).redirect("/login");
        }

        next();
    } catch (error) {
        return res.status(400).send({ error: "Unauthorized" });
    }
};
