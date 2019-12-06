const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user");

const Post = require("../models/post");

const jwt = require("jsonwebtoken");

const nodemailer = require('nodemailer');

const checkAuth = require('../middleware/check-auth');

const Contact = require('../models/contact');

const Nexmo = require('nexmo');

const router = express.Router();

const nexmo = new Nexmo({
  apiKey: '078fe5ba',
  apiSecret: 'qvJuY0lWVmtjujSU'
}, { debug: true });

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
        contacts: [],
        contactgroups: []
      });
      user
        .save()
        .then(result => {
          Post.find().then(posts => {
            for (let i = 0; i < posts.length; i++) {
              for (let j = 0; j < posts[i].guests.length; j++) {
                if (posts[i].guests[j] === result.email) {
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
          let transporter = nodemailer.createTransport({
            service: 'gmail',
              auth: {
                user: 'celebremosnwmsu@gmail.com',
                pass: 'Madhu@876'
              }
          });
          // Message object
          let message = {
            from: 'Celebremos <celebremosnwmsu@gmail.com>',
            to: result.email,
            subject: 'Activate username',
            text: 'CELEBREMOS',
            html:
              '<p>Thank you for registering with us. In order to login you have to verify your email address. To verify, please click link below</p>' +
              'http://localhost:4200/activateUser/' + result._id +
              '<br><br>' + 'Please ignore this mail if you already did. Please report us if you are not the one who created the account.' +
              '<h3>----Team----</h3><h3>Celebremos</h3>'
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
      if (user.activationStatus === false) {
        return res.status(401).json({
          title: "Activation Required",
          message: "Looks like you have created an account but haven't verified your email address. Please check your email address for verification."
        });
      } else {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
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
        expiresIn: 3600,
        userId: fetchedUser._id
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
        //Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
          service: 'gmail',
              auth: {
                user: 'celebremosnwmsu@gmail.com',
                pass: 'Madhu@876'
              }
        });
        // Message object
        let message = {
          from: 'Celebremos <celebremosnwmsu@gmail.com>',
          to: fetchedUser.email,
          subject: 'Reset your account password',
          text: 'CELEBREMOS',
          html: '<h3>Hello ' + fetchedUser.firstname + ',</h3>' +
            '<p>You told us you forget your password. If you really did, click below to choose a new one:</p>' +
            'http://localhost:4200/reset/' + user.id +
            '<br><br>' + 'If you didn\'t mean to reset your password, then you can just ignore this email, your password will not change.' +
            '<h3>----Team----</h3><h3>Celebremos</h3>'
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
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'celebremosnwmsu@gmail.com',
                pass: 'Madhu@876'
              }
            });
            // Message object
            let message = {
              from: 'Celebremos <celebremosnwmsu@gmail.com>',
              to: result.email,
              subject: 'Password Changed Successfully',
              text: 'CELEBREMOS',
              html:
                '<p>Password is updated successfully. In order to login with the updated password please naviate to our home page by clicking the below URL.</p>' +
                'http://localhost:4200' +
                '<br><br>' + 'Please report us if you are not the one who initiated the password reset process.' +
                '<h3>----Team----</h3><h3>Celebremos</h3>'
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
            res.status(201).json({
              title: "Password Reset Successful.",
              message: 'Your password is successfully changed. You can now login with the updated password.'
            });
          })
        });
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

router.get('/contactgroups/:userId', function (req, res, next) {
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
        contacts: fetchedUser.contactgroups,
        message: "Fetched Contact Groups Successfuly",
      });
    });
});

router.put('/user/contacts/:userId', checkAuth, (req, res, next) => {
  const username = req.params.userId;
  const contact = new Contact({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    emailid: req.body.emailid,
    mobilenumber: req.body.mobilenumber,
  });
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
      if (req.body.contactgroupId === '') {
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

          });
        })
      } else {
        for (let i = 0; i < fetchedUser.contactgroups.length; i++) {
          let arr2 = JSON.stringify(fetchedUser.contactgroups[i]._id);
          const contactID = arr2.replace(/"/g, '');
          if (contactID === req.body.contactgroupId) {
            fetchedUser.contactgroups[i].groupcontacts.push(contact);
          }
        }
        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: {
            "contactgroups": fetchedUser.contactgroups
          }
        }).then(result => {
          res.status(200).json({
            message: "The contact is added successfully",
          });
        })
      }
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
          res.status(200).json({
            _id: fetchedUser.contacts[i]._id,
            firstname: fetchedUser.contacts[i].firstname,
            lastname: fetchedUser.contacts[i].lastname,
            emailid: fetchedUser.contacts[i].emailid,
            mobilenumber: fetchedUser.contacts[i].mobilenumber,
            contactgroup: 'No group'
          }
          )
        }
      }
      for (let i = 0; i < fetchedUser.contactgroups.length; i++) {
        for (let j = 0; j < fetchedUser.contactgroups[i].groupcontacts.length; j++) {
          let arr2 = JSON.stringify(fetchedUser.contactgroups[i].groupcontacts[j]._id);
          const contactID = arr2.replace(/"/g, '');
          if (contactID === req.params.contactId) {
            res.status(200).json({
              _id: fetchedUser.contactgroups[i].groupcontacts[j]._id,
              firstname: fetchedUser.contactgroups[i].groupcontacts[j].firstname,
              lastname: fetchedUser.contactgroups[i].groupcontacts[j].lastname,
              emailid: fetchedUser.contactgroups[i].groupcontacts[j].emailid,
              mobilenumber: fetchedUser.contactgroups[i].groupcontacts[j].mobilenumber,
              contactgroup: fetchedUser.contactgroups[i].groupName
            });
          }
        }
      }
    });
});

router.put('/user/contacts/:userId/:contactId', checkAuth, (req, res, next) => {
  const username = req.params.userId;
  const contactIds = req.params.contactId;
  const contact = req.body.contact
  let contactingg = [];
  let updatedContacts = [];
  let contacting = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    emailid: req.body.emailid,
    mobilenumber: req.body.mobilenumber
  }
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      let isNewContact = true;
      if (req.body.contactgroupId === '') {
        for (let i = 0; i < fetchedUser.contacts.length; i++) {
          let arr2 = JSON.stringify(fetchedUser.contacts[i]._id);
          const contactID = arr2.replace(/"/g, '');
          if (contactID === req.params.contactId) {
            isNewContact = false;
            fetchedUser.contacts[i] = contacting;
          }
        }
        let contactGroupsToBeUpdated = [];
        if (isNewContact) {
          fetchedUser.contacts.push(contacting);
          for (let i = 0; i < fetchedUser.contactgroups.length; i++) {
            let contacts = [];
            for (let j = 0; j < fetchedUser.contactgroups[i].groupcontacts.length; j++) {
              let arr2 = JSON.stringify(fetchedUser.contactgroups[i].groupcontacts[j]._id);
              const contactID = arr2.replace(/"/g, '');
              if (contactID === req.params.contactId) {
              } else {
                contacts.push(fetchedUser.contactgroups[i].groupcontacts[j]);
              }
            }
            contactGroupsToBeUpdated.push({ _id: fetchedUser.contactgroups[i]._id, groupName: fetchedUser.contactgroups[i].groupName, groupcontacts: contacts })
          }
        }
        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: {
            "contacts": fetchedUser.contacts,
            "contactgroups": contactGroupsToBeUpdated
          }
        }).then(result => {
          res.status(200).json({
            title: "Contact id added to user successfully. ",
            message: 'Chill mama'
          });
        })
      } else {
        for (let i = 0; i < fetchedUser.contactgroups.length; i++) {
          let arr2 = JSON.stringify(fetchedUser.contactgroups[i]._id);
          const contactID = arr2.replace(/"/g, '');
          if (contactID === req.body.contactgroupId) {
            let contacts = [];
            if (fetchedUser.contactgroups[i].groupcontacts.length === 0) {
              contacts.push(contacting);
              contactingg.push({ _id: fetchedUser.contactgroups[i]._id, groupName: fetchedUser.contactgroups[i].groupName, groupcontacts: contacts })
            } else {
              for (let j = 0; j < fetchedUser.contactgroups[i].groupcontacts.length; j++) {
                let isNewContact = true;
                let arr2 = JSON.stringify(fetchedUser.contactgroups[i].groupcontacts[j]._id);
                const contactID = arr2.replace(/"/g, '');
                if (contactID === req.params.contactId) {
                  isNewContact = false;
                  contacts.push(contacting);
                } else {
                  contacts.push(fetchedUser.contactgroups[i].groupcontacts[j]);
                }
              }
              if(isNewContact){
                contacts.push(contacting)
              }
              contactingg.push({ _id: fetchedUser.contactgroups[i]._id, groupName: fetchedUser.contactgroups[i].groupName, groupcontacts: contacts })
            }
          } else {
            let contacts = [];
            for (let j = 0; j < fetchedUser.contactgroups[i].groupcontacts.length; j++) {

              let arr2 = JSON.stringify(fetchedUser.contactgroups[i].groupcontacts[j]._id);
              const contactID = arr2.replace(/"/g, '');
              if (contactID === req.params.contactId) {

              } else {
                contacts.push(fetchedUser.contactgroups[i].groupcontacts[j]);
              }
            }
            contactingg.push({ _id: fetchedUser.contactgroups[i]._id, groupName: fetchedUser.contactgroups[i].groupName, groupcontacts: contacts })
          }
          updatedContacts = [];
          for (let i = 0; i < fetchedUser.contacts.length; i++) {
          let arr2 = JSON.stringify(fetchedUser.contacts[i]._id);
          const contactID = arr2.replace(/"/g, '');
          if (contactID === req.params.contactId) {

          }else {
            updatedContacts.push(fetchedUser.contacts[i])
          }
        }
        }

        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: {
            "contacts": updatedContacts,
            "contactgroups": contactingg
          }
        }).then(result => {
          res.status(200).json({
            message: "The contact is added successfully",
          });
        })
      }
    });
});

router.delete('/api/contacts/:id/:user', checkAuth, (req, res, next) => {
  const username = req.params.user;
  let contacting = [];
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.contacts.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.contacts[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.id) {
        } else {
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

router.delete('/api/contactgroup/:id/:user/:contactgroupId', checkAuth, (req, res, next) => {
  const username = req.params.user;
  let contacting = [];
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.contactgroups.length; i++) {
        let arr2 = JSON.stringify(fetchedUser.contactgroups[i]._id);
        const contactID = arr2.replace(/"/g, '');
        if (contactID === req.params.contactgroupId) {
          let contacts = [];
          for (let j = 0; j < fetchedUser.contactgroups[i].groupcontacts.length; j++) {
            let arr2 = JSON.stringify(fetchedUser.contactgroups[i].groupcontacts[j]._id);
            const contactID = arr2.replace(/"/g, '');
            if (contactID === req.params.id) {

            } else {
              contacts.push(fetchedUser.contactgroups[i].groupcontacts[j]);
            }
          }
          contacting.push({ _id: fetchedUser.contactgroups[i]._id, groupName: fetchedUser.contactgroups[i].groupName, groupcontacts: contacts })
        } else {
          contacting.push(fetchedUser.contactgroups[i]);
        }
      }
      User.updateOne({
        username: fetchedUser.username
      }, {
        $set: {
          "contactgroups": contacting
        }
      }).then(result => {
        res.status(200).json({
          title: "Deleted successfully",
          message: 'Deleted!!'
        });
      })
    });
});

router.get('/api/getuseremail/:username', checkAuth, (req, res, next) => {
  const username = req.params.username;
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      res.status(200).json(fetchedUser.email);
    });
});

router.put('/user/addcontactsgroup/:userId', checkAuth, (req, res, next) => {
  let contacting = [];
  const username = req.params.userId;
  let contactsgroups = [];
  for (let i = 0; i < req.body.groupContacts.length; i++) {
    let contact = {
      firstname: req.body.groupContacts[i].firstname,
      lastname: req.body.groupContacts[i].lastname,
      mobilenumber: req.body.groupContacts[i].mobilenumber,
      emailid: req.body.groupContacts[i].emailid
    }
    contactsgroups.push(contact)
  }
  const contactgroup = {
    groupName: req.body.groupName,
    groupcontacts: contactsgroups
  };
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
      fetchedUser.contactgroups.push(contactgroup)
      for (let i = 0; i < req.body.groupContacts.length; i++) {
        for (let j = 0; j < fetchedUser.contacts.length; j++) {
          let arr2 = JSON.stringify(fetchedUser.contacts[j]._id);
          const contactID = arr2.replace(/"/g, '');
          if (contactID === req.body.groupContacts[i].id) {
            fetchedUser.contacts.splice(i, 1);
          }
        }
      }
      User.updateOne({
        username: fetchedUser.username
      }, {
        $set: {
          "contactgroups": fetchedUser.contactgroups,
          "contacts": fetchedUser.contacts
        }
      }).then(result => {
        res.status(200).json({
          message: "The event has been successfully created and invitations are sent to your guests email address/phone numbers.",

        });
      })
    });
});

router.put('/user/activate', function (req, res, next) {
  let fetchedUser;
  User
    .findOne({ _id: req.body.email })
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
        res.status(200).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      })
    });
});

router.put('/user/sendresponsetoguest', checkAuth, (req, res, next) => {
  // Create a SMTP transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
              auth: {
                user: 'celebremosnwmsu@gmail.com',
                pass: 'Madhu@876'
              }
        });
        if (Number(req.body.guestemailId)) {
          nexmo.message.sendSms(
            '16469928733', req.body.guestemailId, '<h3>Hello' + ',</h3>' +
            '<p>Below is the reply from your host.</p>' +
             req.body.message +
            '<br><br>' + 'In case you have more questions, please send a mail to host at ' + '<a href="' + req.body.useremailId +'">' + req.body.useremailId+ '</a>' + '.<br>' +
            '<h3>----Team----</h3><h3>Celebremos</h3>'
            , { type: 'unicode' },
            (err, responseData) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }else {
        // Message object
        let message = {
          from: 'Celebremos <celebremosnwmsu@gmail.com>',
          to: req.body.guestemailId,
          subject: 'Reply from host',
          text: 'CELEBREMOS',
          html: '<h3>Hello' + ',</h3>' +
            '<p>Below is the reply from your host.</p>' +
             req.body.message +
            '<br><br>' + 'In case you have more questions, please send a mail to host at ' + '<a href="' + req.body.useremailId +'">' + req.body.useremailId+ '</a>' + '.<br>' +
            '<h3>----Team----</h3><h3>Celebremos</h3>'
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
        res.status(200).json({
          title: "User activated.",
          message: 'You can now login with the username and password.'
        });
      }
});

module.exports = router;
