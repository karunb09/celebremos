const express = require("express");

const Post = require('../models/post');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const nodemailer = require('nodemailer');

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
  post.save().then(createdPost => {
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
          user: 'kylee.simonis24@ethereal.email',
          pass: 'xjAxxwbVcWGg2m2wku'
        }
      });
      for (let i = 0; i < createdPost.guests.length; i++) {
        if (Number(createdPost.guests[i])) {
          console.log(Number(createdPost.guests[i]));
          nexmo.message.sendSms(
            '16469928733', createdPost.guests[i], 'You are invited to a ' + createdPost.type + ' invitation. Please RSVP by clicking the below link.' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i] + ' ', { type: 'unicode' },
            (err, responseData) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          //Message object
          let message = {
            from: 'Celebremos <haripriyarao.jupally@gmail.com>',
            to: createdPost.guests[i],
            subject: 'You have an invitation',
            text: 'CELEBREMOS',
            html:
              '<p>You are invited to a ' + createdPost.type + ' invitation. Please RSVP by clicking the below link. </p>' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i]
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
        }
      }
    });
    res.status(201).json({
      title: "Event created succesfully",
      message: "The event has been successfully created and invitations are sent to your guests email address/phone numbers.",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Events fetched successfully!',
      posts: documents
    });
  });
});

router.delete('/api/posts/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(201).json({
      title: 'Are you sure you want to delete the event?',
      message: 'If you click Okay the event will be deleted. To remain on this page click cancel.',
      result: result
    });
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
    imagePath: this.imagePath,
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
      // Create a SMTP transporter object
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
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          });
        }
      }
    });
    res.status(201).json({
      title: "Event updated succesfully",
      message: "The event has been successfully updated and updated invitations are sent to your guests email address/phone numbers.",
      postId: post._id
    });
  })
});

router.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'Post not found' });
    }
  })
});


module.exports = router;
