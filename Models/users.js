const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  aadharNumber: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date },
  modifiedAt: { type: Date },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
