const mongoose = require("mongoose");

const user = new mongoose.Schema({
  email: { type: String, required: true },
  allId: { type: [String], required: true },
  password: { type: String, required: true },
  theme: { type: String, required: true },
});

const UserDB = mongoose.model("User", user);

module.exports = UserDB;
