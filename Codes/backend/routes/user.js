const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/user/register", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
        .then(hash => {
          console.log("1sdas");
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hash,
    phonenumber: req.body.phone
     });
  user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

module.exports = router;
