"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var app = express();
var mailRoutes = express.Router();
//const multer = require('multer');
//const { Readable } = require('stream');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
//const querystring = require('querystring');
//const request = require('request');
//const { parse, stringify } = require('node-html-parser');
var mail = require('../mail');
if (mail.couldNotCreate) {
    console.log("Could not create mail transporter which is required by the send_mail route. Refusing to continue.");
    process.exit(1);
}
else {
    // Mail transporter has been created successfully
    // Continuing to create routes
    var sendEmail_1 = mail.sendEmail;
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
    mailRoutes.route('/report_issue_anon').post(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var emailBody, subject, mailObj, nodemailerResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("reporting an issue from an anonymous user");
                    console.log(req.body);
                    subject = req.body.subject || "USER ISSUE REPORT --- ANONYMOUS";
                    // Make sure the client has sent a message in the body
                    if (!req.body.message) {
                        res.status(400).json({ message: "ERROR: Refusing to send email with no message" });
                        return [2 /*return*/];
                    }
                    emailBody = req.body.message;
                    // If the req.body contains the do_not_send property, don't send an email 
                    //console.log("Checking if the do_not_send property is present");
                    if (req.body.do_not_send) {
                        res.status(200)
                            .json({ message: "You asked not to actually send an email." });
                        return [2 /*return*/];
                    }
                    mailObj = {
                        from: "nrobinso@tcd.ie",
                        recipients: ["nrobinso@tcd.ie"],
                        subject: subject,
                        message: emailBody,
                    };
                    console.log("sending email");
                    console.log(sendEmail_1);
                    return [4 /*yield*/, sendEmail_1(mailObj).catch(function (err) {
                            console.dir(err);
                            res.status(400);
                            return;
                            // res.json({ message: "ERROR: There was an error while trying to send the email" });
                        })];
                case 1:
                    nodemailerResponse = _a.sent();
                    console.log(nodemailerResponse);
                    console.log("email sent successfully from /mail/report_issue_anon endpoint");
                    res.status(200).json({ message: "Email sent successfully." });
                    return [2 /*return*/];
            }
        });
    }); });
    module.exports = mailRoutes;
}
