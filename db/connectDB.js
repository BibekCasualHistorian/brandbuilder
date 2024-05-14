const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/brandbuilder");
};

module.exports = connectDB;
