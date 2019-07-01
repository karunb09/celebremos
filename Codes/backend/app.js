const express = require('express');

const bodyParser = require('body-parser');

const Post = require('./models/post');

const mongoose = require('mongoose');

const postroutes = require("./routes/posts");
const userroutes = require("./routes/users");

var db = mongoose.connect("mongodb://localhost: 27017/Posts", { useNewUrlParser: true }, function(err, response){
  if (err) {
    console.log(err);
  }else{
    console.log('Connected to database');
  }
});

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: "Post added succesfully"
  })
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: documents
    });
  });

});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then (result => {
    console.log(result);
    res.status(200).json({
      message: 'Posts deleted!'
    });
  })
});


app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({
    _id: req.params.id
  }, post).then (result => {
    console.log(result);
    res.status(200).json({
      message: 'Posts updated!'
    });
  })
});

app.use("/api/posts",postroutes);
app.use("/api/users",userroutes);

module.exports = app;
