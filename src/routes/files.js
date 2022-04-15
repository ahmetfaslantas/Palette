const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { authVerify } = require("../middleware/authverify");
const {
    courseExistsVerify,
    instructorVerify
} = require("../middleware/courseverify");
const logger = require("../logger");

const router = express.Router();

const userUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let path =
                `${process.env.UPLOAD_ROOT}/uploads/` +
                `students/${req.res.locals.userId}/`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            cb(null, path);
        },
        filename: (req, file, cb) => {
            let edition = 1;
            let extension = file.originalname.split(".").pop();
            let filename = file.originalname.split(".").slice(0, -1).join(".");
            let path =
                `${process.env.UPLOAD_ROOT}/uploads/students/` +
                `${req.res.locals.userId}/${file.originalname}`;
            let name = file.originalname;
            while (fs.existsSync(path)) {
                path =
                    `${process.env.UPLOAD_ROOT}/uploads/students/` +
                    `${req.res.locals.userId}/` +
                    `${filename}_${edition}.${extension}`;
                name = `${filename}_${edition}.${extension}`;
                edition++;
            }
            if (req.res.locals.fileNames === undefined) {
                req.res.locals.fileNames = [];
            }
            req.res.locals.fileNames.push(name);
            cb(null, name);
        },
    }),
});

const courseUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let path =
                `${process.env.UPLOAD_ROOT}/uploads/` +
                `courses/${req.res.locals.course._id}/`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            cb(null, path);
        },
        filename: (req, file, cb) => {
            let edition = 1;
            let extension = file.originalname.split(".").pop();
            let filename = file.originalname.split(".").slice(0, -1).join(".");
            let path =
                `${process.env.UPLOAD_ROOT}/uploads/courses/` +
                `${req.res.locals.course._id}/${file.originalname}`;
            let name = file.originalname;
            while (fs.existsSync(path)) {
                path =
                    `${process.env.UPLOAD_ROOT}/uploads/courses/` +
                    `${req.res.locals.course._id}/` +
                    `${filename}_${edition}.${extension}`;
                name = `${filename}_${edition}.${extension}`;
                edition++;
            }
            if (req.res.locals.fileNames === undefined) {
                req.res.locals.fileNames = [];
            }
            req.res.locals.fileNames.push(name);
            cb(null, name);
        },
    }),
});

router.post(
    "/user/upload",
    [authVerify, userUpload.array("files")],
    async (req, res) => {
        logger.info(`Uploading files for user ${req.res.locals.userId}`);
        res.status(200).send({
            message: "File(s) uploaded",
            files: res.locals.fileNames,
        });
    }
);

router.post(
    "/course/:id/upload",
    [authVerify, courseExistsVerify, instructorVerify, courseUpload.array("files")],
    async (req, res) => {
        logger.info(`Uploading files for course ${req.params.id}`);
        res.status(200).send({
            message: "File(s) uploaded",
            files: res.locals.fileNames,
        });
    }
);

module.exports = router;
