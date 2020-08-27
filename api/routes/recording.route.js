const express = require('express');
const app = express();
const recordingRoutes = express.Router();
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const { Readable } = require('stream');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const querystring = require('querystring');
const request = require('request');
const { parse, stringify } = require('node-html-parser');

let VoiceRecording = require('../models/recording');
let User = require('../models/user');

let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = client.db('an-scealai');
});

// Add new recording to DB
recordingRoutes.route('/addRecordingForUser/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            res.json(err);
        }
        if(user) {
            if(req.body.recording) {
                let recording = new VoiceRecording();
                recording.storyData = req.body.recording.storyData;
                recording.userId = user._id;
                recording.date = new Date();
                recording.addedToHistory = req.body.recording.addedToHistory;
                recording.paragraphAudioIds = new Map();
                recording.sentenceAudioIds = new Map();
                console.log(recording);
                recording.save().then(() => {
                    res.status(200).json("Recording added succesfully");
                })
            } else {
                res.status(400).json("Bad request, must include recording object in request body");
            }
        } else {
            res.status(404).json("User does not exist");
        }
    });
});

// Get most up-to-date recording for user
recordingRoutes.route('/getCurrentRecording/:id/:storyId').get((req, res) => { 
    VoiceRecording.find({'userId':req.params.id, 'addedToHistory': false, 'storyData.id': req.params.storyId}, (err, recording) => {
        if(err) {
            res.json(err);
        }
        if(recording) {
            res.status(200).json(recording);
        } else {
            res.status(404).json("This recording does not exist.");
        }
    });
});

// Get all recordings for user
recordingRoutes.route('/recordingsForStory/:id/:storyId').get((req, res) => {
    VoiceRecording.find({'userId':req.params.id, 'addedToHistory': true, "storyData.id":req.params.storyId}, (err, recording) => {
        if(err) {
            res.json(err);
        }
        if(recording) {
            res.status(200).json(recording);
        } else {
            res.status(404).json("User does not have any recordings.");
        }
    });
});

// Add recording to history
recordingRoutes.route('/updateHistoryStatus/:id').post((req, res) => {
    VoiceRecording.findById(req.params.id, (err, recording) => {
        if(err) res.json(err);
        if(recording) {
            recording.addedToHistory = true;
            recording.save();
            res.status(200).json({"message" : "Recording added to history successfully"});
        } else {
            res.status(404).json({"message" : "Recording does not exist"});
        }
    });
});

// Update recording text
recordingRoutes.route('/updateRecordingText/:id').post((req, res) => {
    VoiceRecording.findById(req.params.id, (err, recording) => {
        if(err) res.json(err);
        if(recording) {
          recording.storyData.text = req.body.text;
          recording.save();
          res.status(200).json({"message" : "Text updated successfully"});
          
        } else {
            res.status(404).json({"message" : "Recording does not exist"});
        }
    });
});

//Get audio recording for a specific paragraph / sentence
recordingRoutes.route('/getRecordedAudio/:id/:index/:type').get((req, res) => {
    VoiceRecording.findById(req.params.id, (err, recording) => {
      if(err) res.json(err);
        if(recording) {
          if(req.params.type === "paragraph" && recording.paragraphAudioIds.get(req.params.index)) {
              var audioId;
              try {
                  audioId = new ObjectID(recording.paragraphAudioIds.get(req.params.index).toString());
              } catch(err) {
                  return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
              }
            
              res.set('content-type', 'audio/mp3');
              res.set('accept-ranges', 'bytes');

              let bucket = new mongodb.GridFSBucket(db, {
                  bucketName: 'recordings'
              });
          
              let downloadStream = bucket.openDownloadStream(audioId);
          
              downloadStream.on('data', (chunk) => {
                  res.write(chunk);
              });
          
              downloadStream.on('error', () => {
                  res.sendStatus(404);
              });
          
              downloadStream.on('end', () => {
                  res.end();
              });
          } 
          else if (req.params.type === "sentence" && recording.sentenceAudioIds.get(req.params.index)) {
              var audioId;
              try {
                  audioId = new ObjectID(recording.sentenceAudioIds.get(req.params.index).toString());
              } catch(err) {
                return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
              }
          
              res.set('content-type', 'audio/mp3');
              res.set('accept-ranges', 'bytes');

              let bucket = new mongodb.GridFSBucket(db, {
                  bucketName: 'recordings'
              });
          
              let downloadStream = bucket.openDownloadStream(audioId);
              downloadStream.on('data', (chunk) => {
                  res.write(chunk);
              });
          
              downloadStream.on('error', () => {
                  res.sendStatus(404);
              });
          
              downloadStream.on('end', () => {
                  res.end();
              });
          }
          else {
              //res.status(404).json({"message" :"No audio recording has been associated with this paragraph/sentence"});
          }
        } 
        else {
            res.status(404).json({"message" : "Recording does not exist"});
        }
    });
});

// Update recordings  
recordingRoutes.route('/updateRecordings/:id/:index/:type').post((req, res) => {
  VoiceRecording.findById(req.params.id, (err, recording) => {
      if(err) res.json(err);
      if(recording) {
          const storage = multer.memoryStorage();
          const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
          upload.single('audio')(req, res, (err) => {
              if (err) {
                  return res.status(400).json({ message: "Upload Request Validation Failed" });
              }

              const readableTrackStream = new Readable();
              readableTrackStream.push(req.file.buffer);
              readableTrackStream.push(null);

              let bucket = new mongodb.GridFSBucket(db, {
                  bucketName: 'recordings'
              });
            
            //delete recording if it already exists for paragraph/sentence
              if(req.params.type === "paragraph") {
                if(recording.paragraphAudioIds.get(req.params.index)) {
                  var audioId;
                  try {
                      audioId = new ObjectID(recording.paragraphAudioIds.get(req.params.index).toString());
                  } catch(err) {
                      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
                  }

                  let downloadStream = bucket.delete(audioId);
                }
              }
              else {
                if(recording.sentenceAudioIds.get(req.params.index)) {
                  var audioId;
                  try {
                      audioId = new ObjectID(recording.sentenceAudioIds.get(req.params.index).toString());
                  } catch(err) {
                      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
                  }

                  let downloadStream = bucket.delete(audioId);
                }
              }

              let uploadStream = bucket.openUploadStream(req.params.type + "-" + req.params.index + "-recording-" + recording._id.toString());
              
              if(req.params.type === "paragraph") {
                console.log("set " + req.params.index + " to " + uploadStream.id);
                recording.paragraphAudioIds.set(req.params.index, uploadStream.id);
              }
              else {
                console.log("set " + req.params.index + " to " + uploadStream.id);
                recording.sentenceAudioIds.set(req.params.index, uploadStream.id);
              }
              
              console.log(req.params.index);
              console.log(req.params.type);
              console.log("Paragraph ids", recording.paragraphAudioIds);
              console.log("sentence ids", recording.sentenceAudioIds);
              recording.update();
              recording.save();
              readableTrackStream.pipe(uploadStream);

              uploadStream.on('error', () => {
                  return res.status(500).json({ message: "Error uploading audio" });
              });

              uploadStream.on('finish', () => {
                  return res.status(201).json({ message: "Audio uploaded successfully, stored under Mongo"});
              });
          });
      } else {
          res.status(404).json({"message" : "Recording does not exist"});
      }
  });
});


/*
* Synthesise a story given the story id 
*/
recordingRoutes.route('/synthesiseRecording/:id').get((req, res) => {
    VoiceRecording.findById(req.params.id, (err, recording) => {
        if(recording) {
            let story = recording.storyData;
            let dialectCode;
            if(story.dialect === 'connemara') dialectCode = 'ga_CM';
            if(story.dialect === 'donegal') dialectCode = 'ga_GD';
            if(story.dialect === 'kerry') dialectCode = 'ga_MU';

            // create a form with the story text, dialect choice, html, and speed
            let form = {
                Input: story.text,
                Locale: dialectCode,
                Format: 'html',
                Speed: '1',
            };
            
            // turn form into a url query string
            let formData = querystring.stringify(form);
            let contentLength = formData.length;
            
            // make a request to abair passing in the form data
            request({
                headers: {
                'Host' : 'www.abair.tcd.ie',
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                uri: 'https://www.abair.tcd.ie/webreader/synthesis',
                body: formData,
                method: 'POST'
            }, function (err, resp, body) {
                if(err) res.send(err);
                if(body) {
                    // audioContainer is chunk of text made up of paragraphs
                    let audioContainer = parse(body.toString()).querySelectorAll('.audio_paragraph');
                    let paragraphs = [];
                    let urls = [];
                    // loop through every paragraph and fill array of sentences
                    for(let p of audioContainer) {
                        let sentences = [];
                        for(let s of p.childNodes) {
                            // push the sentences
                            if(s.tagName === 'span') {
                                sentences.push(s.toString());
                            } 
                            // push the audio ids for the sentences
                            else if(s.tagName === 'audio') {
                                urls.push(s.id);
                            }
                        }
                        paragraphs.push(sentences);
                    }
                    res.json({ html : paragraphs, audio : urls });
                } else {
                    res.json({status: '404', message: 'No response from synthesiser'});
                }
            });
        } else {
          console.log("No recording found");
            res.json({status: '404', message: 'Recording not found'});
        }
    });
});

module.exports = recordingRoutes;