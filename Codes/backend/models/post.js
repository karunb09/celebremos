const contact = require('./contact')

const mongoose = require("mongoose");


const postScheme = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  imagePath: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  host: { type: String, required: false },
  location: { type: String, required: true },
  content: { type: String, required: false },
  guests: { type: [String], required: false },
  responses: { type: [{
    email: { type: String, required: false },
    numberofguests: { type: String, required: false },
    status: {type: String, required: false },
    questions: {type: String, required: false },
  }], required: false },
  question: { type: [{
    questionname: { type: String, required: false },
    options: { type: [{
      optionvalue: { type: String, required: false },
      emails: { type: [String], required: false },
    }], required: false }
  }], required: false },
  itemstobring: { type: [{
    itemname: { type: String, required: false },
    quantity: { type: String, required: false },
  }], required: false },
  photos: { type: [String], required: false },
  foodmenu: { type: [String], required: false },
});


module.exports = mongoose.model('Post', postScheme);
