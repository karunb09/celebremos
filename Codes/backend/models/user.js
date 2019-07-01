const mongoose = require("mongoose");
const uniqueValidation = require("mongoose-unique-validator");

const UserScheme = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: Number, required: true },
});

UserScheme.plugin(uniqueValidation);

module.exports = mongoose.model('User', UserScheme);