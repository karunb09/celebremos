const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const contactScheme = mongoose.Schema({
  id: {type: String, required: true},
  firstname: { type: String, required: false },
  lastname: { type: String, required: false },
  mobilenumber: { type: String, required: false, unique: true},
  emailid: { type: String, required: false, unique: true},
});

contactScheme.plugin(uniqueValidator);

module.exports = mongoose.model('Contact', contactScheme);
