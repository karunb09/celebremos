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

router.post('/user/reset-password', function (req, res, next) {
  let fetchedUser;
  var api_key = '85f7897f8ac24054f24460647a0a2338-4836d8f5-ad5c1574';
  var domain = 'sandbox26f7266e41864dab9a24f7d5678b7744.mailgun.org';
  var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Your email is not registered with us. Please sign up before you login."
        });
      }
      fetchedUser = user;
      let data = {
        from: '"<Celebremos>" vishalreddy.ca@gmail.com',
        to: fetchedUser.email,
        subject: 'Reset your account password',
        html: '<h4><b>Reset Password</b></h4>' +
          '<p>To reset your password, complete this form:</p>' +
          ' http://localhost:4200/reset/' + user.id +
          '<br><br>' +
          '<p>--Team--</p><br><p>Celebremos</p>'
      };
      mailgun.messages().send(data, function (error, body) {
      });
    });
})

router.put('/user/store-password', function (req, res, next) {
  let fetchedUser;
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Your email is not registered with us. Please sign up before resetting password."
        });
      }
      fetchedUser = user;
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          User.updateOne({
            email: fetchedUser.email
          }, {
              $set: { "password": hash }
            }).then(result => {
              console.log(result);
              res.status(200).json({
                message: 'User updated!'
              });
            })
        });
    });
});

module.exports = router;
