const winston = require("winston");

const format = winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), format),
    transports: [
        new winston.transports.File({
            filename: process.env.LOG_FILE,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), format),
        })
    );
}

module.exports = logger;
