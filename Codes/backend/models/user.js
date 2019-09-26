const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userScheme = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: false },
  activationStatus: { type: Boolean, required: true},
});

userScheme.plugin(uniqueValidator);

module.exports = mongoose.model('User', userScheme);
