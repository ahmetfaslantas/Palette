const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../../.env")});

module.exports = async (on) => {
  await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
  });

  on("task", {
    async "db:drop"() {
      await mongoose.connection.db.dropDatabase();
      return null;
    },
  });
};
