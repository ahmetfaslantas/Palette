const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { authVerify } = require("../middleware/authverify");

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let path = `${process.env.UPLOAD_ROOT}/uploads/students/${req.res.locals.userId}/`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            cb(null, path);
        },
        filename: (req, file, cb) => {
            let edition = 1;
            let extension = file.originalname.split(".").pop();
            let filename = file.originalname.split(".").slice(0, -1).join(".");
            let path = `${process.env.UPLOAD_ROOT}/uploads/students/${req.res.locals.userId}/${file.originalname}`;
            let name = file.originalname;
            while (fs.existsSync(path)) {
                path = `${process.env.UPLOAD_ROOT}/uploads/students/${req.res.locals.userId}/${filename}_${edition}.${extension}`;
                name = `${filename}_${edition}.${extension}`;
                edition++;
            }
            cb(null, name);
        }
    })
});

router.post("/upload", [authVerify, upload.array("files")], async (req, res) => {
    res.status(200).send({ message: "File(s) uploaded" });
});

module.exports = router;