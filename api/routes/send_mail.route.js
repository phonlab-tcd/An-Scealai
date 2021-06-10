const express = require('express');
const app = express();
const mailRoutes = express.Router();
//const multer = require('multer');
//const { Readable } = require('stream');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
//const querystring = require('querystring');
//const request = require('request');
//const { parse, stringify } = require('node-html-parser');

const mail = require('../mail');

if(mail.couldNotCreate){
  console.log("Could not create mail transporter which is required by the send_mail route. Refusing to continue.");
  process.exit(1);
}
else {

  // Mail transporter has been created successfully
  // Continuing to create routes
  const sendEmail = mail.sendEmail;

  /*
  const mailObj = {
    from: "nrobinso@tcd.ie",
    recipients: ["scealai.info@gmail.com"],
    subject: "TEST 2 -- With passwords hidden -- This was send by nodejs",
    message: "Hi everybody!",
  };

  sendEmail(mailObj).then((res) => {
    console.log(res);
  });
  */


  mailRoutes.route('/report_issue_anon').post((req, res) => {

    console.log("reporting an issue from an anonymous user");
    console.log(req.body);

    let emailBody;
    if(req.body.message){
      emailBody = req.body.message
      if(emailBody === ""){
        res.statusCode.json({ error: "Message body empty. Refusing to send email."});
        res.send();
        return;
      }
    }
    else{
      res.json({ error: "No message found in body of POST request to /mail/report_issue_anon"});
      res.send();
      return
    }

    if(! req.body.do_not_send){
      const mailObj = {
        from: "nrobinso@tcd.ie",
        recipients: ["scealai.info@gmail.com"],
        subject: "User issue report: anonymous",
        message: emailBody,
      };


      sendEmail(mailObj).then((res2) => {
        if(res2 === 'ok'){
          console.log("email sent successfully from /mail/report_issue_anon endpoint");
          res.statusCode(200).json({ ok: "The email seems to have been sent successfully"});
        }
      }).catch( err => {
        res.json(err)
        console.dir(err);
      });
    }

    res.send();

  });

  module.exports = mailRoutes;
}
