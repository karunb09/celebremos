const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const contactScheme = mongoose.Schema({
  firstname: { type: String, required: false },
  lastname: { type: String, required: false },
  mobilenumber: { type: String, required: false, unique: true },
  emailid: { type: String, required: true, unique: false, unique: true },
});

contactScheme.plugin(uniqueValidator);

module.exports = mongoose.model('Contact', contactScheme);
