"use strict";
var express = require('express');
var app = express();
var chatbotRoute = express.Router();
var fs = require('fs');
var https = require("https");
var querystring = require('querystring');
var request = require('request');
var _a = require('node-html-parser'), parse = _a.parse, stringify = _a.stringify;
var multer = require('multer');
var Readable = require('stream').Readable;
var formidable = require('formidable');
var util = require('util');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.use(multipartMiddleware);
// Require Chatbot model in our routes module
var Models = require('../models/chatbot');
//Add user started
chatbotRoute.route('/addUser').post(function (req, res) {
    var bot = new Models.Chatbot(req.body);
    console.log(bot);
    bot.save().then(function (bot) {
        res.status(200).send("Saved to DB");
    })
        .catch(function (err) {
        res.status(400).send("unable to save to DB");
    });
});
//Add to logs by id/name
chatbotRoute.route('/addLog/').post(function (req, res) {
    var obj = req.body;
    var newLog = {
        date: obj.date,
        topic: obj.topic,
        complete: obj.complete,
        conversation: obj.conversation
    };
    var log = new Models.Log(newLog);
    Models.Chatbot.findOne({ "username": obj.username }, function (err, bot) {
        var thisBot;
        if (bot) {
            thisBot = bot;
            thisBot.logs.push(log);
        }
        else {
            var newUserBotObj = {
                username: obj.username,
                _id: obj._id,
                role: obj.role,
                logs: []
            };
            thisBot = new Models.Chatbot(newUserBotObj);
            thisBot.logs.push(log);
        }
        thisBot.save().then(function (thisBot) {
            res.json('Update complete');
        }).catch(function (err) {
            console.log(err);
            res.status(400).send("Unable to update");
        });
    });
});
//clear logs by username
chatbotRoute.route('/clearLogs/:name').get(function (req, res) {
    Models.Chatbot.findOne({ "username": req.params.name }, function (err, bot) {
        console.log(bot);
        console.log(req.params.name);
        if (err)
            res.status(400).send("Unable to update");
        else {
            bot.logs = [];
            bot.save().then(function (bot) {
                res.json('logs removed');
            });
            res.status(200).send("Logs Removed");
        }
    });
});
chatbotRoute.route('/getAudio').post(function (req, res) {
    var bubble = new Models.AudioBubble(req.body);
    //console.log(bubble);
    if (bubble.text) {
        var form = {
            Input: bubble.text,
            Locale: "ga_" + bubble.dialect,
            Format: 'html',
            Speed: '1',
        };
        var formData = querystring.stringify(form);
        var contentLength = formData.lenght;
        request({
            headers: {
                'Host': 'www.abair.tcd.ie',
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            uri: 'https://www.abair.tcd.ie/webreader/synthesis',
            body: formData,
            method: 'POST'
        }, function (err, resp, body) {
            if (err)
                res.send(err);
            if (body) {
                var audioContainer = parse(body.toString()).querySelectorAll('.audio_paragraph');
                var paragraphs = [];
                var urls = [];
                for (var _i = 0, audioContainer_1 = audioContainer; _i < audioContainer_1.length; _i++) {
                    var p = audioContainer_1[_i];
                    var sentences = [];
                    for (var _a = 0, _b = p.childNodes; _a < _b.length; _a++) {
                        var s = _b[_a];
                        if (s.tagName === 'span') {
                            sentences.push(s.toString());
                        }
                        else if (s.tagName === 'audio') {
                            urls.push(s.id);
                        }
                    }
                    paragraphs.push(sentences);
                }
                //console.log("Success!");
                res.json({ html: paragraphs, audio: urls });
            }
            else {
                console.log("Fail");
                res.json({ status: '404', message: 'No response from synthesiser' });
            }
        });
    }
    else {
        res.json({ status: '404', message: 'Text not found' });
    }
});
chatbotRoute.route('/addAudio/').post(function (req, res) {
    console.log(req.body);
    console.log(req.file);
});
module.exports = chatbotRoute;
