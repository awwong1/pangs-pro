"use strict";

var express = require('express');
var helmet = require('helmet');
var mustacheExpress = require('mustache-express');
var env = process.env;

var app = express();
app.use(helmet());

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', 'client');

app.get('/', function(req, res) {
  res.render('index', {
    contactForm: true
  });
});

app.post('/', function(req, res) {
  res.render('index', {
    contactForm: false,
    contactMessage: "Message has been sent. Thank you!"
  });
});

// serve all static files inside the client directory
app.use(express.static('client'));

// health probe check for OpenShift
app.get('/health', function (req, res) {
  res.send('1');
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
