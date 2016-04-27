"use strict";

var express = require('express');
var helmet = require('helmet');
var env = process.env;

var app = express();
app.use(helmet());

app.use(express.static('client'));


app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
