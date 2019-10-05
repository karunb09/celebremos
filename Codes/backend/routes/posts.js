const express = require("express");

const Post = require('../models/post');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const nodemailer = require('nodemailer');

router.post('/api/posts', checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    type: req.body.type,
    date: req.body.date,
    time: req.body.time,
    host: req.body.host,
    location: req.body.location,
    content: req.body.content,
    guests: req.body.guests,
    accepted: req.body.accepted,
    denied: req.body.denied,
    ambigous: req.body.ambigous
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
            user: 'linda41@ethereal.email',
            pass: 'vkBejPYGRFBtzNWeHZ'
        }
      });

      for(let i = 0; i< createdPost.guests.length; i++){


      // Message object
      let message = {
        from: 'Celebremos <haripriyarao.jupally@gmail.com>',
        to: createdPost.guests[i],
        subject: 'You have an invitation',
        text: 'CELEBREMOS',
        html:
          '<p>You are invited to a' + createdPost.type + ' invitation. Please RSVP by clicking the below link. </p>' + 'http://localhost:4200/rsvp/' + createdPost._id + '/' + createdPost.guests[i]
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
  });
    res.status(201).json({
      message: "Post added succesfully",
      postId: createdPost._id
    });
  });
});

router.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });
});

router.delete('/api/posts/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Posts deleted!'
    });
  })
});

router.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    type: req.body.type,
    date: req.body.date,
    time: req.body.time,
    host: req.body.host,
    location: req.body.location,
    content: req.body.content,
    guests: req.body.guests,
    accepted: req.body.accepted,
    denied: req.body.denied,
    ambigous: req.body.ambigous
  })
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
            user: 'linda41@ethereal.email',
            pass: 'vkBejPYGRFBtzNWeHZ'
        }
      });

      for(let i = 0; i< post.guests.length; i++){

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
  });
    res.status(200).json({
      message: 'Posts updated!'
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
