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
  createdEvents: { type: [mongoose.Schema.Types.ObjectId], ref: "Post", required: false},
  savedEvents: { type: [mongoose.Schema.Types.ObjectId], ref: "Post", required: false},
  invitedEvents: { type: [mongoose.Schema.Types.ObjectId], ref: "Post", required: false},
  contactgroups: {type: [ {
    groupName: { type: String, required: false },
    groupcontacts: { type: [ {
      firstname: { type: String, required: false },
      lastname: { type: String, required: false },
      mobilenumber: { type: String, required: false },
      emailid: { type: String, required: false },
    }
    ], required: false},
  }], required: false},
  contacts: { type: [ {
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    mobilenumber: { type: String, required: false },
    emailid: { type: String, required: false },
  }
  ], required: false},
});

userScheme.plugin(uniqueValidator);

module.exports = mongoose.model('User', userScheme);
