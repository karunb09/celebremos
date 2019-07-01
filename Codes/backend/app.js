const express = require('express');

const bodyParser = require('body-parser');


const postsRoutes = require('./routes/posts')

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

app.use( postsRoutes);

app.use("/api/posts",postroutes);
app.use("/api/users",userroutes);

module.exports = app;
