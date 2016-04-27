"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var helmet = require('helmet');
var mustacheExpress = require('mustache-express');

var Mailgun = require('mailgun-js');
var mailgun_api_key = process.env.MAILGUN_API_KEY || 'key';
var mailgun_domain = process.env.MAILGUN_DOMAIN || 'domain';
var mailgun = new Mailgun({apiKey: mailgun_api_key, domain: mailgun_domain});


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', 'client');

app.get('/', function (req, res) {
  res.render('index', {
    contactForm: true
  });
});

app.post('/', function (req, res) {
  console.log(req.body);
  var fromName = req.body.name || 'No Name';
  var fromEmail = req.body.email || 'noreply@pangspro.com';
  var fromMessage = req.body.message || 'No message';

  var fromField = fromName + ' <' + fromEmail + '>';
  var toField = 'Pangs Pro <pangspro@outlook.com>';
  var subject = 'Pangs Pro Contact Form';

  var data = {
    from: fromField,
    to: toField,
    bcc: 'Alexander Wong <admin@alexander-wong.com>',
    subject: subject,
    text: fromMessage,
    html: fromMessage
  };

  mailgun.messages().send(data, function (err, body) {
    //If there is an error, render the error page
    if (err) {
      res.render('index', {
        contactForm: false,
        contactMessage: 'Message could not be sent. Please contact using email or telephone?'
      });
    }
    else {
      res.render('index', {
        contactForm: false,
        contactMessage: "Message has been sent successfully! Thank you!"
      });
    }
  });
});

// serve all static files inside the client directory
app.use(express.static('client'));

// health probe check for OpenShift
app.get('/health', function (req, res) {
  res.send('1');
});

app.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
