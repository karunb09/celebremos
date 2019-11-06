const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const Post = require("../models/post");

const jwt = require("jsonwebtoken");

const nodemailer = require('nodemailer');

const checkAuth = require('../middleware/check-auth');

const Contact = require('../models/contact');

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
        phonenumber: req.body.phone,
        activationStatus: false,
        createdEvents: [],
        savedEvents: [],
        invitedEvents: [],
        contacts: []
      });
      user
        .save()
        .then(result => {
          Post.find().then(posts => {
            for(let i = 0; i< posts.length; i++) {
              for(let j=0; j< posts[i].guests.length; j++ ) {
                if(posts[i].guests[j] === result.email) {
                  result.invitedEvents.push(posts[i]._id)
                }
              }
            }
            User.updateOne({
              email: result.email
            }, {
              $set: { "invitedEvents": result.invitedEvents }
            }).then(result1 => {
              res.status(200).json({
                title: "Event updated",
                message: 'You can now login with the username and password.'
              });
            });
          });

          return res.status(201).json({
            title: "Congratulations!",
            message: "Your account is created. In order to login you have to activate your username by clicking on the link that is mailed to your email address.",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            title: "OOPS! Username/Email is already taken.",
            message: "The username or email that you have provided is already taken!"
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
          title: "Invalid Credentails!",
          message: "You have entered invalid username or password. Please try again."
        });
      }
      if (user.activationStatus) {
        return res.status(401).json({
          title: "Activation Required",
          message: "Looks like you have created an account but haven't verified your email address. Please check your email address for verification."
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          title: "Invalid Credentails!",
          message: "You have entered invalid username or password. Please try again."
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
        title: "Invalid Credentails!",
        message: "You have entered invalid username or password. Please try again."
      });
    });
});

router.post('/user/reset-password', function (req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: "Not a registered user!",
          message: "Seems like our database couldn\'t find you. Please register with us before you login."
        });
      }
      fetchedUser = user;
      nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error('Failed to create a testing account. ' + err.message);
          return process.exit(1);
        }
        console.log('Credentials obtained, sending message...');
        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          security: false,
          auth: {
            user: 'linda41@ethereal.email',
            pass: 'vkBejPYGRFBtzNWeHZ'
          }
        });
        // Message object
        let message = {
          from: 'Celebremos <haripriyarao.jupally@gmail.com>',
          to: fetchedUser.email,
          subject: 'Reset your account password',
          text: 'CELEBREMOS',
          html: fetchedUser.firstname + ", <br>" +
            '<p>You told us you forget your password. If you really did, click below to choose a new one:</p>' +
            'http://localhost:4200/reset/' + user.id +
            '<br><br>' + 'If you didn\'t mean to reset your password, the you can just ignore this email, your password will not change.' +
            '<p>--Team--</p><br><p>Celebremos</p>'
        };
        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
      });
      res.status(201).json({
        title: "Password Reset Email Sent",
        message: 'An email has been sent to your provided email address. Follow the directions in the email to reset your password.'
      })
    });
})

router.put('/user/store-password', function (req, res, next) {
  console.log(req.body);
  let fetchedUser;
  User
    .findOne({ _id: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: "Email not registered!",
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
            res.status(201).json({
              title: "Password Successfully Resetted.",
              message: 'Your password is successfully changed. You can now login with the updated password.'
            });
          })
        });
    });
});

router.put('/user/activateuser', function (req, res, next) {
  let fetchedUser;
  User
    .findOne({ id: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: "User is not active",
          message: "Please activate your username by clicking on the link sent to your email address."
        });
      }
      fetchedUser = user;
      User.updateOne({
        email: fetchedUser.email
      }, {
        $set: { "activationStatus": true }
      }).then(result => {
        res.status(201).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    });
});


router.get('/contacts/:userId', function (req, res, next) {
  let fetchedUser;
  User
    .findOne({ username: req.params.userId })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: "User is not active",
          message: "Please activate your username by clicking on the link sent to your email address."
        });
      }
      fetchedUser = user;
    }).then(result => {
      res.status(200).json({
        contacts: fetchedUser.contacts,
        message: "Fetched Contacts Successfuly",
      });
    });
});

router.put('/user/contacts/:userId', checkAuth, (req, res, next) => {
  console.log(req.body);
  const username = req.params.userId;
  console.log(username);
  console.log(req.body.firstname);
  const contact = new Contact({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    emailid: req.body.emailid,
    mobilenumber: req.body.mobilenumber,
  });
  console.log(contact.firstname);

  User
    .findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: "User is not active",
          message: "Please activate your username by clicking on the link sent to your email address."
        });
      }
      fetchedUser = user;
      fetchedUser.contacts.push(contact)
      User.updateOne({
        username: fetchedUser.username
      }, {
        $set: {
          "contacts": fetchedUser.contacts
        }
      }).then(result => {
        res.status(200).json({
          message: "The event has been successfully created and invitations are sent to your guests email address/phone numbers.",
          contact: {
            id: createdContact._id
          }
        });
      })
    });
});

router.get('/contacts/:userId/:contactId', checkAuth, (req, res, next) => {
  const username = req.params.userId;
  const contactIds = req.params.contactId;
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.contacts.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.contacts[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.contactId) {
          res.status(200).json(fetchedUser.contacts[i]);
        }
      }
    });
});

router.put('/user/contacts/:userId/:contactId', checkAuth, (req, res, next) => {
  const username = req.params.userId;
  const contactIds = req.params.contactId;
  const contact = req.body.contact
  console.log(req.body.firstname);
  let contacting = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    emailid: req.body.emailid,
    mobilenumber: req.body.mobilenumber
  }
  console.log(contactIds);
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.contacts.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.contacts[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.contactId) {
          fetchedUser.contacts[i] = contacting;
          User.updateOne({
            username: fetchedUser.username
          }, {
            $set: {
              "contacts": fetchedUser.contacts
            }
          }).then(result => {
            res.status(200).json({
              title: "Contact id added to user successfully. ",
              message: 'Chill mama'
            });
          })
        }
      }
    });
});

router.delete('/api/contacts/:id/:user', checkAuth, (req, res, next) => {
  const username = req.params.user;
  let contacting = [];
  console.log(username);
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.contacts.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.contacts[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.id) {
          console.log(fetchedUser.contacts[i]);
        }else{
          contacting.push(fetchedUser.contacts[i]);
        }
      }
      User.updateOne({
        username: fetchedUser.username
      }, {
        $set: {
          "contacts": contacting
        }
      }).then(result => {
        res.status(200).json({
          title: "Deleted successfully",
          message: 'Deleted!!'
        });
      })
    });
});


module.exports = router;
