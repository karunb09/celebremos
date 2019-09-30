const mongoose = require("mongoose");

const rsvp = mongoose.Schema({
  accepted: { type: [String], required: false },
  denied: { type: [String], required: false },
  ambiguous: { type: [String], required: false }
});

const postScheme = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  host: { type: String, required: false },
  location: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  content: { type: String, required: false },
  guests: { type: [String], required: false },
  responses: { type: rsvp, required: false }
});



module.exports = mongoose.model('Post', postScheme);
