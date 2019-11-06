const express = require("express");

const Post = require('../models/post');

const Contact = require('../models/contact');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const nodemailer = require('nodemailer');

const User = require("../models/user");

const Nexmo = require('nexmo');

const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const nexmo = new Nexmo({
  apiKey: '078fe5ba',
  apiSecret: 'qvJuY0lWVmtjujSU'
}, { debug: true });


router.post('/api/posts', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const username = req.body.username;
  const contacts = req.body.contacts;
  const url = req.protocol + '://' + req.get('host');
  console.log(url + "/images/" + req.file.filename);
  const post = new Post({
    title: req.body.title,
    type: req.body.type,
    imagePath: url + "/images/" + req.file.filename,
    date: req.body.date,
    time: req.body.time,
    host: req.body.host,
    location: req.body.location,
    content: req.body.content,
    guests: req.body.guests,
    accepted: req.body.accepted,
    denied: req.body.denied,
    ambiguous: req.body.ambiguous
  });
  let contact;
  let contactsss = [];
  for (let i = 0; i < contacts.length; i++) {
    let splitString = contacts[i].split('$');
    const contact = new Contact({
      firstname: splitString[0],
      lastname: splitString[1],
      mobilenumber: splitString[3],
      emailid: splitString[2]
    });
    console.log(contact)
    contactsss.push(contact)
  }
  post.save().then(createdPost => {
    let fetchedUser;
    let fetchedInvitedUser;
    console.log(createdPost);
    User.find().then(users => {
      for (let i = 0; i < createdPost.guests.length; i++) {
        for (let j = 0; j < users.length; j++) {
          if (createdPost.guests[i] === users[j].email) {
            User.findOne({ email: users[j].email }).then(user => {
              fetchedInvitedUser = user;
              console.log(fetchedInvitedUser.username);
              fetchedInvitedUser.invitedEvents.push(createdPost._id)
              console.log(fetchedInvitedUser.invitedEvents)
              User.updateOne({
                email: users[j].email
              }, {
                $set: { "invitedEvents": fetchedInvitedUser.invitedEvents }
              }).then(result => {
                res.status(200).json({
                  title: "Invited Successfully",
                  message: 'Your password is successfully changed.'
                });
              })
            });
          }
        }
      }
    });
    User
      .findOne({ username: username })
      .then(user => {
        fetchedUser = user;
        fetchedUser.createdEvents.push(createdPost._id)
        fetchedUser.contacts = contactsss;
        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: {
            "createdEvents": fetchedUser.createdEvents,
            "contacts": fetchedUser.contacts
          }
        }).then(result => {
          res.status(200).json({
            title: "Event id added to event successfully. ",
            message: 'Your password is successfully changed. You can now login with the updated password.'
          });
        })
      });
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
      }
      console.log('Credentials obtained, sending message...');
      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        security: false,
        auth: {
          user: 'kylee.simonis24@ethereal.email',
          pass: 'xjAxxwbVcWGg2m2wku'
        }
      });
      // for (let i = 0; i < createdPost.guests.length; i++) {
      //   if (Number(createdPost.guests[i])) {
      //     console.log(Number(createdPost.guests[i]));
      //     nexmo.message.sendSms(
      //       '16469928733', createdPost.guests[i], 'You are invited to a ' + createdPost.type + ' invitation. Please RSVP by clicking the below link.' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i] + ' ', { type: 'unicode' },
      //       (err, responseData) => {
      //         if (err) {
      //           console.log(err);
      //         }
      //       }
      //     );
      //   } else {
      //     //Message object
      //     let message = {
      //       from: 'Celebremos <haripriyarao.jupally@gmail.com>',
      //       to: createdPost.guests[i],
      //       subject: 'You have an invitation',
      //       text: 'CELEBREMOS',
      //       html:
      //         '<p>You are invited to a ' + createdPost.type + ' invitation. Please RSVP by clicking the below link. </p>' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i]
      //     };
      //     transporter.sendMail(message, (err, info) => {
      //       if (err) {
      //         console.log('Error occurred. ' + err.message);
      //         return process.exit(1);
      //       }
      //       console.log('Message sent: %s', info.messageId);
      //       // Preview only available when sending through an Ethereal account
      //       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      //     });
      //   }
      // }
    });
    res.status(200).json({
      title: "Event created succesfully",
      message: "The event has been successfully created and invitations are sent to your guests email address/phone numbers.",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});


router.post('/api/saveposts', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const username = req.body.username;
  const contacts = req.body.contacts;
  const url = req.protocol + '://' + req.get('host');
  console.log(url + "/images/" + req.file.filename);
  const post = new Post({
    title: req.body.title,
    type: req.body.type,
    imagePath: url + "/images/" + req.file.filename,
    date: req.body.date,
    time: req.body.time,
    host: req.body.host,
    location: req.body.location,
    content: req.body.content,
    guests: req.body.guests,
    accepted: req.body.accepted,
    denied: req.body.denied,
    ambiguous: req.body.ambiguous
  });
  let contact;
  let contactsss = [];
  for (let i = 0; i < contacts.length; i++) {
    let splitString = contacts[i].split('$');
    const contact = new Contact({
      firstname: splitString[0],
      lastname: splitString[1],
      mobilenumber: splitString[3],
      emailid: splitString[2]
    });
    console.log(contact)
    contactsss.push(contact)
  }
  console.log(contactsss)
  post.save().then(savedPost => {
    let fetchedUser;
    User
      .findOne({ username: username })
      .then(user => {
        fetchedUser = user;
        fetchedUser.savedEvents.push(savedPost._id)
        fetchedUser.contacts = contactsss;
        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: {
            "savedEvents": fetchedUser.savedEvents,
            "contacts": fetchedUser.contacts
          }
        }).then(result => {
          res.status(200).json({
            title: "Event id added to event successfully. ",
            message: 'Your password is successfully changed. You can now login with the updated password.'
          });
        })
      });
    res.status(200).json({
      title: "Event saved succesfully",
      message: "The event has been successfully saved and invitations are not sent to your guests email address/phone numbers.",
      post: {
        ...savedPost,
        id: savedPost._id
      }
    });
  });
});



router.get('/api/postslist/:id', checkAuth, (req, res, next) => {
  const username = req.params.id;
  let posts = [];
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.createdEvents.length - 1; i++) {
        Post.findById(fetchedUser.createdEvents[i]).then((post) => {
          if (post) {
            posts.push(post);
          } else {
            res.status(400).json({ message: 'Post not found' });
          }
        })
      }
      Post.findById(fetchedUser.createdEvents[fetchedUser.createdEvents.length - 1]).then((post) => {
        if (post) {
          posts.push(post);
          res.status(200).json({
            message: "Events fetched Successfully!!",
            posts: posts
          });
        } else {
          res.status(200).json("Events not found");
        }
      })
    });
});

router.get('/api/posts/:id', checkAuth, (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
})

router.get('/api/savedlist/:id', checkAuth, (req, res, next) => {
  const username = req.params.id;
  let posts = [];
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.savedEvents.length - 1; i++) {
        Post.findById(fetchedUser.savedEvents[i]).then((post) => {
          if (post) {
            posts.push(post);
          } else {
            res.status(400).json({ message: 'Post not found' });
          }
        })
      }
      Post.findById(fetchedUser.savedEvents[fetchedUser.savedEvents.length - 1]).then((post) => {
        if (post) {
          posts.push(post);
          res.status(200).json({
            message: "Events fetched Successfully!!",
            posts: posts
          });
        } else {
          res.status(200).json("Events not found");
        }
      })
    });
});

router.get('/api/alleventslist/:id', checkAuth, (req, res, next) => {
  const username = req.params.id;
  let posts = [];
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;
      for (let i = 0; i < fetchedUser.savedEvents.length - 1; i++) {
        Post.findById(fetchedUser.savedEvents[i]).then((post) => {
          if (post) {
            posts.push(post);
          } else {
            res.status(400).json({ message: 'Post not found' });
          }
        })
      }
      Post.findById(fetchedUser.savedEvents[fetchedUser.savedEvents.length - 1]).then((post) => {
        if (post) {
          posts.push(post);
          res.status(200).json({
            message: "Events fetched Successfully!!",
            posts: posts
          });
        } else {
          res.status(200).json("Events not found");
        }
      })
    });
});

router.get('/api/invitedlist/:id', checkAuth, (req, res, next) => {
  const username = req.params.id;
  console.log("Inside the username");
  let posts = [];
  let fetchedUser;
  User
    .findOne({ username: username })
    .then(user => {
      fetchedUser = user;

      for (let i = 0; i < fetchedUser.invitedEvents.length - 1; i++) {
        Post.findById(fetchedUser.invitedEvents[i]).then((post) => {
          if (post) {
            posts.push(post);
          } else {
            res.status(400).json({ message: 'Post not found' });
          }
        })
      }
      Post.findById(fetchedUser.invitedEvents[fetchedUser.invitedEvents.length - 1]).then((post) => {
        if (post) {
          console.log(post);
          posts.push(post);
          res.status(200).json({
            message: "Events fetched Successfully!!",
            posts: posts
          });
        } else {
          res.status(200).json("Events not found");
        }
      })
    });
});

router.delete('/api/posts/:id/:user', checkAuth, (req, res, next) => {
  const username = req.params.user;
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    User
      .findOne({ username: username })
      .then(user => {
        fetchedUser = user;
        let fetchedEvents = [];
        console.log(fetchedUser.createdEvents);
        let arr2 = JSON.stringify(fetchedUser.createdEvents[i]);
        const contactID = arr2.replace(/"/g, '');
        for (let i = 0; i < fetchedUser.createdEvents.length; i++) {
          if (contactID === req.params.id) {

          } else {
            fetchedEvents.push(fetchedUser.createdEvents[i]);
          }
        }
        console.log(fetchedEvents);

        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: { "createdEvents": fetchedEvents }
        }).then(result => {
          res.status(200).json({
            title: "Event id added to event successfully. ",
            message: 'Your password is successfully changed. You can now login with the updated password.'
          });
        })
      });
    console.log(result);
  })
});

router.put('/api/posts/:id', multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  console.log(imagePath);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    type: req.body.type,
    imagePath: imagePath,
    date: req.body.date,
    time: req.body.time,
    host: req.body.host,
    location: req.body.location,
    content: req.body.content,
    guests: req.body.guests,
    accepted: req.body.accepted,
    denied: req.body.denied,
    ambiguous: req.body.ambiguous
  })
  console.log(post);
  Post.updateOne({
    _id: req.params.id
  }, post).then(result => {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
      }
      console.log('Credentials obtained, sending message...');
      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        security: false,
        auth: {
          user: 'kylee.simonis24@ethereal.email',
          pass: 'xjAxxwbVcWGg2m2wku'
        }
      });
      for (let i = 0; i < post.guests.length; i++) {
        if (Number(post.guests[i])) {
          console.log(Number(post.guests[i]));
          nexmo.message.sendSms(
            '16469928733', post.guests[i], 'You are invited to a ' + post.type + ' invitation. Please RSVP by clicking the below link.' + 'http://localhost:4200/rsvp/' + post._id + '/' + post.guests[i] + '\t.', { type: 'unicode' },
            (err, responseData) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          // Message object
          let message = {
            from: 'Celebremos <haripriyarao.jupally@gmail.com>',
            to: post.guests[i],
            subject: 'You have an invitation',
            text: 'CELEBREMOS',
            html:
              '<p>You are invited to a' + post.type + ' invitation. Please RSVP by clicking the below link. </p>' + 'http://localhost:4200/rsvp/' + post._id + '/' + post.guests[i]
          };
          transporter.sendMail(message, (err, info) => {
            if (err) {
              console.log('Error occurred. ' + err.message);
              return process.exit(1);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          });
        }
      }
    });
    res.status(200).json({
      title: "Event updated succesfully",
      message: "The event has been successfully updated and updated invitations are sent to your guests email address/phone numbers.",
      postId: post._id
    });
  })
});

router.post('/api/posts/update/:id/:username', multer({ storage: storage }).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  let username = req.params.username;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  console.log(imagePath);
  const post = new Post({
    title: req.body.title,
    type: req.body.type,
    imagePath: imagePath,
    date: req.body.date,
    time: req.body.time,
    host: req.body.host,
    location: req.body.location,
    content: req.body.content,
    guests: req.body.guests,
    accepted: req.body.accepted,
    denied: req.body.denied,
    ambiguous: req.body.ambiguous
  })
  let contacting = [];
  post.save().then(createdPost => {
    let fetchedUser;
    User
      .findOne({ username: username })
      .then(user => {
        fetchedUser = user;
        fetchedUser.createdEvents.push(createdPost._id);
        for (let i = 0; i < fetchedUser.savedEvents.length; i++) {
          let arr2 = JSON.stringify(fetchedUser.savedEvents[i]);
          const contactID = arr2.replace(/"/g, '');
          if (req.body.id === contactID) {
            console.log(fetchedUser.savedEvents[i])
          } else {
            contacting.push(fetchedUser.savedEvents[i])
          }
        }
        User.updateOne({
          username: fetchedUser.username
        }, {
          $set: {
            "createdEvents": fetchedUser.createdEvents,
            "savedEvents": contacting
          }
        }).then(result => {
          res.status(200).json({
            title: "Event id added to event successfully. ",
            message: 'Your password is successfully changed. You can now login with the updated password.'
          });
        })
      });
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
      }
      console.log('Credentials obtained, sending message...');
      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        security: false,
        auth: {
          user: 'kylee.simonis24@ethereal.email',
          pass: 'xjAxxwbVcWGg2m2wku'
        }
      });
      // for (let i = 0; i < createdPost.guests.length; i++) {
      //   if (Number(createdPost.guests[i])) {
      //     console.log(Number(createdPost.guests[i]));
      //     nexmo.message.sendSms(
      //       '16469928733', createdPost.guests[i], 'You are invited to a ' + createdPost.type + ' invitation. Please RSVP by clicking the below link.' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i] + ' ', { type: 'unicode' },
      //       (err, responseData) => {
      //         if (err) {
      //           console.log(err);
      //         }
      //       }
      //     );
      //   } else {
      //     //Message object
      //     let message = {
      //       from: 'Celebremos <haripriyarao.jupally@gmail.com>',
      //       to: createdPost.guests[i],
      //       subject: 'You have an invitation',
      //       text: 'CELEBREMOS',
      //       html:
      //         '<p>You are invited to a ' + createdPost.type + ' invitation. Please RSVP by clicking the below link. </p>' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i]
      //     };
      //     transporter.sendMail(message, (err, info) => {
      //       if (err) {
      //         console.log('Error occurred. ' + err.message);
      //         return process.exit(1);
      //       }
      //       console.log('Message sent: %s', info.messageId);
      //       // Preview only available when sending through an Ethereal account
      //       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      //     });
      //   }
      // }
    });
    res.status(200).json({
      title: "Event created succesfully",
      message: "The event has been successfully created and invitations are sent to your guests email address/phone numbers.",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});


module.exports = router;
