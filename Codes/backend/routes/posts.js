const express = require("express");

const Post = require('../models/post');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/api/posts', checkAuth, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
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

router.put('/api/posts/:id', checkAuth, (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({
    _id: req.params.id
  }, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Posts updated!'
    });
  })
});

router.get("/api/posts/:id", (req, res, next) => {
  this.post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'Post not found' });
    }
  })
});

module.exports = router;
