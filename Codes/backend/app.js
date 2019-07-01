const express = require('express');

const bodyParser = require('body-parser');

const postsRoutes = require("./routes/posts");

const userRoutes = require("./routes/user");

const mongoose = require('mongoose');


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
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use(postsRoutes);

app.use( userRoutes);

module.exports = app;
