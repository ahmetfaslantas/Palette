const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../../.env")});

module.exports = async (on) => {
  await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
  });

  on("before:spec", async () => {
    await mongoose.connection.db.dropDatabase();
  });

  on("before:run", async () => {
    await mongoose.connection.db.dropDatabase();
  });
};
