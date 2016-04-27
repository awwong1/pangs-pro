"use strict";

var express = require('express');
var helmet = require('helmet');
var env = process.env;

var app = express();
app.use(helmet());

// serve all static files inside the client directory
app.use(express.static('client'));

// health probe check for OpenShift
app.get('/health', function (req, res) {
  res.send('1');
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
