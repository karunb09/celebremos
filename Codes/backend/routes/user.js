const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/user/register", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
        .then(hash => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hash,
    phonenumber: req.body.phone
<<<<<<< HEAD
  });
  console.log(user);
=======
     });
>>>>>>> 2a5086879ee0c4551c150057bd836cd2917d298e
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
          message: "Username or email already taken!"
        });
      });
  });
});


router.post("/user/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid username or password. Please try again."
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        console.log(result);
        return res.status(401).json({
          message: "Invalid username or password. Please try again."
        });
      }
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid username or password. Please try again."
      });
    });
});


module.exports = router;
