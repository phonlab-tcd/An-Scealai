const express = require('express');
const app = express();
const engagementRoutes = express.Router();
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const { Readable } = require('stream');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

let Event = require('../models/event');
let User = require('../models/user');

let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = client.db('an-scealai');
});


engagementRoutes.route('/addEventForUser/:id').post((req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            res.json(err);
        }
        if(user) {
            if(req.body.event) {
                let event = new Event();
                event.type = req.body.event.type;
                event.storyData = req.body.event.storyData;
                event.userId = user._id;
                event.date = new Date();
                event.addedToHistory = req.body.event.addedToHistory;
                event.paragraphAudioIds = new Map();
                event.sentenceAudioIds = new Map();
                console.log(event);
                event.save().then(() => {
                    res.status(200).json("Event added succesfully");
                })
            } else {
                res.status(400).json("Bad request, must include event object in request body");
            }
            

        } else {
            res.status(404).json("User does not exist");
        }
    });
});

engagementRoutes.route('/eventsForUser/:id').get((req, res) => {
    Event.find({'userId':req.params.id}, (err, events) => {
        if(err) {
            res.json(err);
        }
        if(events) {
            res.status(200).json(events);
        } else {
            res.status(404).json("User does not have any events.");
        }
    });
});

engagementRoutes.route('/eventsForStory/:id').get((req, res) => {
    Event.find({"storyData._id" : req.params.id}, (err, events) => {
        if(err) {
            res.json(err);
        }
        if(events) {
            res.status(200).json(events);
        } else {
            res.status(404).json("User does not have any events.");
        }
    });
});

engagementRoutes.route('/getCurrentRecordingEvent/:id/:storyId').get((req, res) => { 
    Event.find({'userId':req.params.id, 'type': "RECORD-STORY", 'addedToHistory': false, 'storyData.id': req.params.storyId}, (err, events) => {
        if(err) {
            res.json(err);
        }
        if(events) {
            res.status(200).json(events);
        } else {
            res.status(404).json("This event does not exist.");
        }
    });
});


engagementRoutes.route('/updateHistoryStatus/:id').post((req, res) => {
    Event.findById(req.params.id, (err, events) => {
        if(err) res.json(err);
        if(events) {
            events.addedToHistory = true;
            events.save();
            res.status(200).json({"message" : "Event added to history successfully"});
        } else {
            res.status(404).json({"message" : "Event does not exist"});
        }
    });
});

//get audio recording for a specific paragraph / sentence
engagementRoutes.route('/getRecordedAudio/:id/:index/:type').get((req, res) => {
    Event.findById(req.params.id, (err, events) => {
      if(err) res.json(err);
        if(events) {
          
          if(req.params.type === "paragraph" && events.paragraphAudioIds.get(req.params.index)) {
            console.log("It's a paragraph!!!");
            console.log(req.params.index);
            console.log(req.params.id);
              var audioId;
              try {
                console.log("id to create:", events.paragraphAudioIds.get(req.params.index).toString());
                  audioId = new ObjectID(events.paragraphAudioIds.get(req.params.index).toString());
              } catch(err) {
                console.log("This stupid error");
                  return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
              }
            
              res.set('content-type', 'audio/mp3');
              res.set('accept-ranges', 'bytes');

              let bucket = new mongodb.GridFSBucket(db, {
                  bucketName: 'recordings'
              });
          
              let downloadStream = bucket.openDownloadStream(audioId);
          
              downloadStream.on('data', (chunk) => {
                console.log("DATA FOUND");
                console.log(chunk);
                  res.write(chunk);
              });
          
              downloadStream.on('error', () => {
                console.log("ERROR");
                  res.sendStatus(404);
              });
          
              downloadStream.on('end', () => {
                  res.end();
              });
          } 
          else if (req.params.type === "sentence" && events.sentenceAudioIds.get(req.params.index)) {
            console.log("It's a sentence!!!");
            
              var audioId;
              try {
                  audioId = new ObjectID(events.sentenceAudioIds.get(req.params.index).toString());
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
                console.log("DATA FOUND");
                  res.write(chunk);
              });
          
              downloadStream.on('error', () => {
                console.log("ERROR");
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
            res.status(404).json({"message" : "Event does not exist"});
        }
    });
});

// Update recordings  
engagementRoutes.route('/updateRecordings/:id/:index/:type').post((req, res) => {
  Event.findById(req.params.id, (err, events) => {
      if(err) res.json(err);
      if(events) {
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
                console.log("THIS IS READ");
                console.log(events.paragraphAudioIds);
                if(events.paragraphAudioIds.get(req.params.index)) {
                  
                  var audioId;
                  try {
                      audioId = new ObjectID(events.paragraphAudioIds.get(req.params.index).toString());
                  } catch(err) {
                      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
                  }

                  let downloadStream = bucket.delete(audioId);
                  console.log("INDEX EXISTED AND DELETED");
                  
                }
              }
              else {
                if(events.sentenceAudioIds.get(req.params.index)) {
                  var audioId;
                  try {
                      audioId = new ObjectID(events.sentenceAudioIds.get(req.params.index).toString());
                  } catch(err) {
                      return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
                  }

                  let downloadStream = bucket.delete(audioId);
                  console.log("INDEX EXISTED AND DELETED");
                  
                }
              }
              
              
              let uploadStream = bucket.openUploadStream(req.params.type + "-" + req.params.index + "-recording-for-event-" + events._id.toString());
              
              if(req.params.type === "paragraph") {
                console.log("set " + req.params.index + " to " + uploadStream.id);
                events.paragraphAudioIds.set(req.params.index, uploadStream.id);
              }
              else {
                console.log("set " + req.params.index + " to " + uploadStream.id);
                events.sentenceAudioIds.set(req.params.index, uploadStream.id);
              }
              
              console.log(req.params.index);
              console.log(req.params.type);
              console.log("Paragraph ids", events.paragraphAudioIds);
              console.log("sentence ids", events.sentenceAudioIds);
              events.update();
              events.save();
              readableTrackStream.pipe(uploadStream);

              uploadStream.on('error', () => {
                  return res.status(500).json({ message: "Error uploading file" });
              });

              uploadStream.on('finish', () => {
                  return res.status(201).json({ message: "File uploaded successfully, stored under Mongo"});
              });
          });
      } else {
          res.status(404).json({"message" : "Event does not exist"});
      }
  });
});

engagementRoutes.route('/eventsForRecording/:id/:storyId').get((req, res) => {
  console.log("THIS IS READ");
    Event.find({'userId':req.params.id, 'type': "RECORD-STORY", "storyData.id":req.params.storyId}, (err, events) => {
        if(err) {
          console.log("ERROR");
            res.json(err);
        }
        if(events) {
          console.log(events);
            res.status(200).json(events);
        } else {
          console.log("NO EVENT");
            res.status(404).json("User does not have any events.");
        }
    });
});


module.exports = engagementRoutes;