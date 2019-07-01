const express = require("express");
const hashing = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/register", (req, res, next) => {
    hashing.hash(req.body.password, 7)
        .then(hash => {
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                password: hash,
                email: req.body.email,
                phonenumber: req.body.phone
            });

            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'user created',
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