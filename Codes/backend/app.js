const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const postsRoutes = require("./routes/posts");

const userRoutes = require("./routes/user");

const Nexmo = require('nexmo');

const socketio = require('socket.io');

const mongoose = require('mongoose');


var db = mongoose.connect("mongodb://localhost: 27017/Posts", { useNewUrlParser: true }, function (err, response) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database');
  }
});

const app = express();

app.use(bodyParser.json());

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use(postsRoutes);

app.use(userRoutes);

module.exports = app;
