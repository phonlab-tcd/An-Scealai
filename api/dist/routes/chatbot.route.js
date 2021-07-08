const express = require('express');
const app = express();
const chatbotRoute = express.Router();
const fs = require('fs');
const https = require("https");
const querystring = require('querystring');
const request = require('request');
const { parse, stringify } = require('node-html-parser');
const multer = require('multer');
const { Readable } = require('stream');
const formidable = require('formidable')
const util = require('util');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.use(multipartMiddleware);


// Require Chatbot model in our routes module
let Models = require('../models/chatbot');

//Add user started
chatbotRoute.route('/addUser').post(function(req, res){
  let bot = new Models.Chatbot(req.body);
  console.log(bot);
  bot.save().then(bot => {
    res.status(200).send("Saved to DB");
  })
    .catch(err => {
      res.status(400).send("unable to save to DB");
    });
});

//Add to logs by id/name
chatbotRoute.route('/addLog/').post(function(req, res){
  var obj = req.body;
  var newLog = {
    date: obj.date,
    topic: obj.topic,
    complete: obj.complete,
    conversation: obj.conversation
  }
  let log = new Models.Log(newLog);
  Models.Chatbot.findOne({"username": obj.username}, function(err, bot){
    var thisBot;
    if(bot){
      thisBot = bot;
      thisBot.logs.push(log);
    }
    else{
      var newUserBotObj = {
        username: obj.username,
        _id: obj._id,
        role: obj.role,
        logs: []
      }
      thisBot = new Models.Chatbot(newUserBotObj);
      thisBot.logs.push(log);
    }
    thisBot.save().then(thisBot =>{
      res.json('Update complete');
    }).catch(err => {
      console.log(err);
      res.status(400).send("Unable to update");
    });
  });
});

//clear logs by username
chatbotRoute.route('/clearLogs/:name').get(function(req, res){
  Models.Chatbot.findOne({"username": req.params.name}, function(err, bot){
    console.log(bot);
    console.log(req.params.name)
    if(err) res.status(400).send("Unable to update");
    else{
      bot.logs = [];
      bot.save().then(bot => {
        res.json('logs removed');
      })
      res.status(200).send("Logs Removed");
    }
  });
});

chatbotRoute.route('/getAudio').post(function(req, res){
  let bubble = new Models.AudioBubble(req.body);
  //console.log(bubble);
  if(bubble.text){
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
        'Host' : 'www.abair.tcd.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function(err, resp, body){
      if(err) res.send(err);
      if(body){
        let audioContainer = parse(body.toString()).querySelectorAll('.audio_paragraph');
        let paragraphs = [];
        let urls = [];
        for(let p of audioContainer) {
            let sentences = [];
            for(let s of p.childNodes) {
                if(s.tagName === 'span') {
                    sentences.push(s.toString());
                } else if(s.tagName === 'audio') {
                    urls.push(s.id);
                }
            }
            paragraphs.push(sentences);
        }
        //console.log("Success!");
        res.json({ html : paragraphs, audio : urls });
      } else {
        console.log("Fail");
        res.json({status: '404', message: 'No response from synthesiser'});
      }
    });
  } else {
    res.json({status: '404', message: 'Text not found'});
  }
});

chatbotRoute.route('/addAudio/').post((req, res) => {
  console.log(req.body);
  console.log(req.file);
});

module.exports = chatbotRoute;
