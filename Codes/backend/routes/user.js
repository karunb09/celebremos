const express = require("express");

const User = require("../models/user");

const router = express.Router();

router.post("api/user/signup", (req, res, next) => {
  const user = new User({
    firstname: req.body.firstname,
    lasstname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phonenumber: req.body.phonenumber
  })
});

module.exports = router;
