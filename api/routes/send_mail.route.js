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


  mailRoutes.route('/report_issue_anon').post(async (req, res) => {

    console.log("reporting an issue from an anonymous user");
    console.log(req.body);

    let emailBody;
    let subject = req.body.subject || "USER ISSUE REPORT --- ANONYMOUS";

    // Make sure the client has sent a message in the body
    if(req.body.message){
      emailBody = req.body.message

      // Refuse to send an email with just an empty string
      if(emailBody === ""){
        res.status(400).json({ error: "Message body empty. Refusing to send email."});
        return;
      }
    }
    else{
      res.json({ error: "No message found in body of POST request to /mail/report_issue_anon. Refusing to send empty email."});
      return;
    }

    // If the req.body contains the do_not_send property, don't send an email 
    console.log("Checking if the do_not_send property is present");
    if(req.body.do_not_send){
      res.json({ not_sending_email: 1});
      return;
    }

    console.log("Constructing the mailObj");
    const mailObj = {
      from: "nrobinso@tcd.ie",
      recipients: ["nrobinso@tcd.ie"],
      subject: subject,
      message: emailBody,
    };

    console.log("sending email");
    console.log(sendEmail);

    await sendEmail(mailObj).then((res2) => {
      if(res2){
        console.log(res2);
        console.log("email sent successfully from /mail/report_issue_anon endpoint");
        res.json({ ok: 1 });
      }
    }).catch( err => {
      console.dir(err);
      res.json({ error: "There was an error while trying to send the email" });
    });

  });

  module.exports = mailRoutes;
}
