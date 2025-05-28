// @ts-nocheck
const logger = require("../logger");
const express = require("express");
const app = express();
const chatbotRoute = express.Router();
const fs = require("fs");
const https = require("https");
const http = require("http");
const querystring = require("querystring");
const request = require("request");
const { parse } = require("node-html-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { ChatbotQuiz } = require("../models/chatbot");
const mongoose = require("mongoose");

// Require Chatbot model in our routes module
let Models = require("../models/chatbot");
var spellings;

// For writing scripts
var punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
var regex = new RegExp("[" + punctuation + "]", "g");
let firstLine = "\n\n+ start\n";
let lastLine = "\n\n+ finish \n- <call>endOfQuiz</call>";
let chatSetup =
  "> object chatSetup javascript\nif(args[1] == 'nowait') return chatSetup(args[0]);\nsetTimeout(function(){\n" +
  "  return chatSetup(args[0], args[1]);\n}, 2500);\nreturn '';\n< object";
let addScore =
  "\n\n> object addScore javascript\naddScore();\nreturn '';\n< object";
let endQuiz =
  "\n\n> object endOfQuiz javascript\nendOfQuiz();\nreturn '';\n< object";

//Create-Quiz Framwork
//builds script content as string & stores in the db
chatbotRoute.route("/createQuiz").post(async function (req, res) {
  logger.info({ endpoint: "/createQuiz" });
  let content = req.body.questionsAndAnswers;
  let title = req.body.title;

  let formattedQuestionsAndAnswers = "";
  let tryAgain = '\n\n+ tryagain\n- <button class="rive-button"';
  tryAgain +=
    " onclick='tryAgain(\"" + title + "\")'>Bain triail as arís?</button>\n";
  tryAgain +=
    "^ <button class='rive-button' onclick='showAnswers()'>Taispeáin na freagraí?</button>";

  //Construct Script
  let line = "";

  line += chatSetup;
  line += addScore;
  line += endQuiz;
  line += firstLine;

  let keys = Object.keys(req.body.questionsAndAnswers);

  // if user wants questions shuffled
  if (req.body.shuffle) keys = keys.sort((a, b) => 0.5 - Math.random());

  for (let key of keys) {
    let nextKey = keys[keys.indexOf(key) + 1];
    let trigger = "";

    formattedQuestionsAndAnswers +=
      "Ceist: " + key + "   Freagra: " + content[key] + "\n\n";

    //let correctTrigger = "Ceart! <call>addScore</call>An chéad cheist eile:<br><br>" + key;

    //- Q1
    line += "- " + key;
    if (keys.indexOf(key) != 0) line += "<call>addScore</call>\n\n";
    else line += "\n\n";

    //+ *
    //% q1
    //- Nope Wrong <call>chatSetup ans1w</call>
    line += "+ *\n% " + key.toLowerCase().replace(regex, "");
    if (nextKey == undefined) {
      line += "\n- Mícheart! <call>chatSetup finish</call>\n\n";
    } else {
      line +=
        "\n- Mícheart! <call>chatSetup q" + keys.indexOf(key) + "w</call>\n\n";
    }

    if (nextKey != undefined) {
      line += "+ q" + keys.indexOf(key) + "w\n";
      line += "- " + nextKey + "\n\n";
    }

    // + Ans1 OR + (Ans1|Ans2)
    if (content[key].length > 1) {
      trigger += "(";
      for (let ans of content[key]) {
        trigger += ans.toLowerCase().replace(regex, "") + "|";
      }
      trigger = trigger.slice(0, -1);
      trigger += ")";
    } else {
      trigger = content[key][0].toLowerCase().replace(regex, "");
    }
    // % q1
    line +=
      "+ " + trigger + "\n% " + key.toLowerCase().replace(regex, "") + "\n";
  }
  line += "- <call>addScore</call><call>chatSetup finish</call>";
  line += lastLine;

  line += tryAgain;

  let s = {
    owner: req.body.userId,
    title: title,
    date: new Date(),
    numOfQuestions: Object.keys(req.body.questionsAndAnswers).length,
    botScript: line,
    content: formattedQuestionsAndAnswers,
    isCommunityScript: false,
  };

  let classroomId = req.body.classroomId;
  if (classroomId) s.classroomId = classroomId;

  //store in db
  if (s.owner != undefined && s.owner != "") {
    //check not already in DB
    ChatbotQuiz.find(
      { owner: req.body.userId, title: title, classroomId: classroomId },
      async function (err, scripts) {
        console.log("Scripts: ", scripts);
        console.log("Error: ", err);
        if (scripts.length > 0) {
          console.log("can't save, already there.");
          res.status(404).json("script already exists");
        } else if (scripts.length == 0) {
          let script = await ChatbotQuiz.create(s);
          script
            .save()
            .then(() => {
              console.log("success");
              res.status(200).json(script);
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json("Error saving to db");
            });
        }
      }
    );
  }
});

//delete script from db by user and script name
chatbotRoute.route("/deleteQuiz/:id").get(async function (req, res) {
  console.log("Delete: ", req.params.id);
  ChatbotQuiz.deleteOne(req.body, function (err, obj) {
    if (err) throw err;
    else if (obj) {
      console.log("deleted successfully");
      res.status(200).send({ message: "script deleted" });
    }
  });
});

// gets scripts ready for use in 'Personal Scripts'
chatbotRoute.route("/getUserQuizzes").post(function (req, res) {
  ChatbotQuiz.find({ owner: req.body.id }, function (err, quizzes) {
    if (quizzes) {
      return res.json(quizzes);
    } else if (quizzes.length == 0) {
      return res.status(404).json("user has no quizzes");
    } else {
      return res.status(400).send(err);
    }
  });
});

// gets community scripts
chatbotRoute.route("/getCommunityQuizzes").get(function (req, res) {
  ChatbotQuiz.find({ isCommunityScript: true }, function (err, quizzes) {
    if (quizzes) {
      return res.json(quizzes);
    } else if (quizzes.length == 0) {
      return res.status(404).json("no community quizzes found");
    } else {
      return res.status(400).send(err);
    }
  });
});

chatbotRoute.route("/setAsCommunityQuiz").post(async function (req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
    return res.status(400).json({ invalidObjectId: req.body.id });
  }

  const quiz = await ChatbotQuiz.findById(req.body.id);
  if (quiz) {
    quiz.isCommunityScript = true;
    quiz
      .save()
      .then(() => {
        return res.json(quiz);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json("Error saving to quiz as community quiz");
      });
  } else return res.status(404).json("Quiz not found in DB");
});

//sets up script for download on user's request
chatbotRoute.route("/getScriptForDownload").post(function (req, res) {
  console.log(req.body);
  if (req.body) {
    if (req.body.role == "TEACHER") req.body.name = "teacher_" + req.body.name;
    ChatbotQuiz.findOne(req.body, function (err, script) {
      console.log("script: ", script);
      if (err) {
        console.log(err);
      } else if (script != null) {
        res.json({ status: 200, text: script.questionsandanswers });
      }
    });
  }
});

chatbotRoute.route("/saveSpellings").post(function (req, res) {
  if (req.body) {
    spellings = req.body;
    console.log("Save spellings: ", spellings);
    res.status(200).send("Spellings Saved");
  }
});

chatbotRoute.route("/getWords").get(function (req, res) {
  console.log("get words: ", spellings);
  if (spellings) res.send(spellings);
});

chatbotRoute.route("/getAudio").post(function (req, res) {
  let bubble = new Models.AudioBubble(req.body);
  console.log("bubble text: ", bubble.text);
  if (bubble.text) {
    var form = {
      Input: bubble.text,
      Locale: "ga_" + bubble.dialect,
      Format: "html",
      Speed: "1",
    };

    var formData = querystring.stringify(form);
    var contentLength = formData.length;

    request(
      {
        headers: {
          Host: "www.abair.ie",
          "Content-Length": contentLength,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        //uri: 'https://www.abair.tcd.ie/webreader/synthesis',
        uri: "https://abair.ie/webreader/synthesis",
        body: formData,
        method: "POST",
      },
      function (err, resp, body) {
        if (err) {
          console.log("ERROR");
          res.send(err);
        }
        if (body) {
          //console.log(body);
          let audioSource = parse(body).querySelector("audio").id;
          console.log("Success!");
          console.log("audio source: ", audioSource);
          res.json({ audio: audioSource });
        } else {
          console.log("Fail");
          res.json({ status: "404", message: "No response from synthesiser" });
        }
      }
    );
  } else {
    res.json({ status: "404", message: "Text not found" });
  }
});

var multer = require("multer");
var upload = multer();
const speech = require("@google-cloud/speech");
const { Model } = require("mongoose");
const client = new speech.SpeechClient();

chatbotRoute
  .route("/sendRecordedAnswer")
  .post(upload.single("file"), async function (req, res) {
    let audioBytes = req.file.buffer.toString("base64");
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: "LINEAR16",
      languageCode: "en-US",
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log(`Transcription: ${transcription}`);
    if (transcription) {
      res.json({ status: 200, text: transcription });
    } else {
      res.json({ status: 404, error: "no transcription found" });
    }
  });

/*
ga_UL, 
ga_UL_anb_exthts, 
ga_UL_anb_nnmnkwii, 
ga_CO, ga_CO_hts, 
ga_CO_pmg_nnmnkwii, 
ga_MU_nnc_exthts, 
ga_MU_nnc_nnmnkwii, 
ga_MU_cmg_nnmnkwii
*/
chatbotRoute.route("/getDNNAudio").post(function (req, res) {
  let bubble = new Models.AudioBubble(req.body);
  console.log("bubble: ", bubble);
  let dialect = "";
  if (bubble.dialect == "UL") dialect = "ga_UL_anb_nnmnkwii";
  else if (bubble.dialect == "CO") dialect = "ga_CO_pmg_nnmnkwii";
  else dialect = "ga_MU_cmg_nnmnkwii";

  console.log("dialect: ", dialect);

  let messageStrings = bubble.text
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|");
  var results = [];
  for (let i = 0; i < messageStrings.length; i++) {
    let input = encodeURIComponent(messageStrings[i]);
    let voice = "&voice=" + encodeURIComponent(dialect);
    let speed = "&speed=" + encodeURIComponent(1);
    let encoding = "&audioEncoding=" + encodeURIComponent("MP3");
    let url =
      "https://api.abair.ie/v3/synthesis?input=" +
      input +
      voice +
      speed +
      encoding;
    axios
      .get(url)
      .then((response) => {
        //console.log(response.data);
        let thing = response.data;
        const type = "audio/mp3";
        const audioURI = "data:" + type + ";base64," + thing.audioContent;
        let thisObj = { id: i, audioString: audioURI };
        results.push(thisObj);
        if (results.length == messageStrings.length) {
          console.log("result length: ", results.length);
          res.json({ audio: results });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

chatbotRoute.route("/getClassroomQuizzes/:id").get(function (req, res) {
  let id = new mongoose.mongo.ObjectId(req.params.id);
  ChatbotQuiz.find({ classroomId: id }, function (err, quizzes) {
    if (quizzes && quizzes.length > 0) return res.json(quizzes);
    return res.json({});
  });
});

// intro bot --> http://legacy.pandorabots.com/pandora/talk?botid=c08188e27e34571c
//AIML Chit-Chat
chatbotRoute.route("/getAIMLResponse").post(function (req, res) {
  let path =
    "http://demo.vhost.pandorabots.com/pandora/talk-xml?botid=" +
    req.body.botId +
    "&input=";
  path += encodeURI(req.body.message);
  http
    .get(path, (resp) => {
      let data = "";
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        if (data) return res.status(200).json(data);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
      return res.json(err.message);
    });
});

chatbotRoute.route("/sendScriptVerification").post(function (req, res) {
  var mailObj = {};
  ChatbotQuiz.findOne(req.body, function (err, script) {
    mailObj = {
      from: "scealai.info@gmail.com",
      recipients: ["scealai.info@gmail.com"],
      subject: "Taidhgín Script Verification",
      message:
        "User: " +
        script.user +
        "\nVerify Script: \n\n" +
        script.questionsandanswers,
    };
    sendEmail(mailObj).then((response) => {
      if (response) {
        res.send("Email sent");
      }
    });
  });
});

const sendEmail = async (mailObj) => {
  let dir = __dirname.substr(0, __dirname.length - 6);
  let data = fs.readFileSync(path.join(dir, "sendinblue.json"));
  let sendinblue_key = JSON.parse(data);

  //code from: https://schadokar.dev/posts/how-to-send-email-in-nodejs/
  const { from, recipients, subject, message, attatchment } = mailObj;

  try {
    // create transporter
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: sendinblue_key.user,
        pass: sendinblue_key.pass,
      },
    });

    //send mail
    let mailStatus = await transporter.sendMail({
      from: from,
      to: recipients,
      subject: subject,
      text: message,
    });

    return `Message sent: ${mailStatus.messageId}`;
  } catch (error) {
    throw new Error(
      `Something went wrong in the sendmail method. Error: ${error.message}`
    );
  }
};

module.exports = chatbotRoute;
