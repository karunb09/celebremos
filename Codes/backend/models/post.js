const mongoose = require("mongoose");


const postScheme = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  imagePath: {type: String, required: true},
  date: { type: String, required: true },
  time: { type: String, required: true },
  host: { type: String, required: false },
  location: { type: String, required: true },
  content: { type: String, required: false },
  guests: { type: [String], required: false },
  accepted: { type: [String], required: false },
  denied: { type: [String], required: false },
  ambiguous: { type: [String], required: false }
});



module.exports = mongoose.model('Post', postScheme);
