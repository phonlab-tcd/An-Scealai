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
const logger = require('../dist/logger.js');

let VoiceRecording = require('../models/recording');
let User = require('../models/user');

let db;
MongoClient.connect('mongodb://localhost:27017/',
  { useNewUrlParser: true, useUnifiedTopology: true},
  (err, client) => {
  if (err) {
    console.log(
      'MongoDB Connection Error in ./api/routes/recording.route.js . Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = client.db('an-scealai');
});

recordingRoutes.route('/create').post((req, res) => {
    const recording = new VoiceRecording(req.body);
    recording.save().then(_ => {
        res.status(200).json({"message" : "Recording created successfully", "recording": recording});
    }).catch(err => {
        console.log(err);
        res.status(400).send("Unable to save to DB");
    });
});

recordingRoutes.route('/:id').get(function(req, res) {
    VoiceRecording.findById(req.params.id, (err, recording) => {
        if(err) {
            console.log(err);
            res.status(400).json({"message" : err.message});
        } else {
            res.json(recording);
        }
    });
});

// Update the audio ids and indices for a given recording
recordingRoutes.route('/updateTracks/:id').post(function (req, res) {
    VoiceRecording.findById(req.params.id, function(err, recording) {
        if(err) {
          console.log(err);
          res.json(err);
        }
        if(recording) {
          
            let bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'voiceRecording'
            });
            
            logger.info("Request Paragraph audio ids: ", req.body.paragraphAudioIds);
            logger.info("Request Paragraph indices: ", req.body.paragraphIndices);
            
            logger.info("\nStored Paragraph audio ids: ", recording.paragraphAudioIds);
            logger.info("Stored Paragraph indices: ", recording.paragraphIndices);
          
            
            if(req.body.paragraphAudioIds) {
                /*
                if(recording.paragraphAudioIds) {
                  req.body.paragraphIndices.forEach(function(entry) {
                    if(recording.paragraphIndices[entry]) {
                      let audioId = recording.paragraphAudioIds[entry];
                      bucket.delete(new ObjectID(audioId.toString()));
                    }
                  })
                  
                }
                */
                recording.paragraphAudioIds = req.body.paragraphAudioIds;
            }
            if(req.body.paragraphIndices) {
                recording.paragraphIndices = req.body.paragraphIndices;
            }
            if(req.body.sentenceAudioIds) {
                recording.sentenceAudioIds = req.body.sentenceAudioIds;
            }
            if(req.body.sentenceIndices) {
                recording.sentenceIndices = req.body.sentenceIndices;
            }
            
            recording.save().then(_ => {
                res.json('Update complete');
            }).catch(_ => {
                res.status(400).send("Unable to update");
            });
        }
    });
})

recordingRoutes.route('/saveAudio/:storyId/:index/:uuid').post((req, res) => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
    upload.single('audio')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Upload Request Validation Failed" });
        }
        // create new stream and push audio data
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
        // get bucket (collection) for storing audio file
        let bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'voiceRecording'
        });
        // get audio file from collection and save id to story audio id
        const fileId = "voice-rec-" + req.params.storyId.toString() + "-" + req.params.uuid.toString();
        let uploadStream = bucket.openUploadStream(fileId);

        // pipe data in stream to the audio file entry in the db 
        readableTrackStream.pipe(uploadStream);

        uploadStream.on('error', () => {
            return res.status(500).json({ message: "Error uploading file" });
        });

        uploadStream.on('finish', () => {
            return res.status(201).json({ message: "File uploaded successfully, stored under Mongo", fileId: uploadStream.id, index: req.params.index});
        });
    }); 
});

recordingRoutes.route('/audio/:id').get((req, res) => {
    let audioId;
    // get the audio id from the audio id set to the story
    try {
        audioId = new ObjectID(req.params.id);
    } catch(err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }

    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    // get collection name for audio files
    let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'voiceRecording'
    });
    // create a new stream of file data using the bucket name
    let downloadStream = bucket.openDownloadStream(audioId);
    // write stream data to response if data is found
    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('error', () => {
        res.sendStatus(404);
    });
    // close the stream after data sent to response
    downloadStream.on('end', () => {
        res.end();
    });
})

recordingRoutes.route('/getHistory/:storyId').get((req, res) => {
  VoiceRecording.find({"storyData._id":req.params.storyId, "archived":true}, (err, recordings) => {
      if(err) {
          console.log(err);
          res.status(400).json({"message" : err.message});
      } else {
          res.json(recordings);
      }
  });
  
});

recordingRoutes.route('/updateArchiveStatus/:recordingId').get((req, res) => {
  VoiceRecording.findById(req.params.recordingId, (err, recording) => {
      if(err) {
          console.log(err);
          res.status(400).json({"message" : err.message});
      } else {
          recording.archived = true;
          recording.save();
      }
  });
  
});

// Delete audio recordings for story
recordingRoutes.route('/deleteStoryRecordingAudio/:id').get((req, res) => {
    VoiceRecording.find({"storyData._id" : req.params.id}, (err, recordings) => {
        if(err) 
          res.status(400).json(err);
        if(!recordings) {
          res.status(404).json({"message" : "Voice Recording does not exist"});
        }
          
        let bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'voiceRecording'
        });
      
        recordings.forEach(recording => {    
          recording.paragraphAudioIds.forEach(paragraphAudioId => {
              bucket.delete(new ObjectID(paragraphAudioId), (err) => {
                if(err) {
                  //console.log("File does not exist");
                  res.status(404).json("Paragraph audio file does not exist");
                }
              });
          });
    
          recording.sentenceAudioIds.forEach(sentenceAudioId => {
              bucket.delete(new ObjectID(sentenceAudioId), (err) => {
                if(err) {
                    //console.log("File does not exist");
                    res.status(404).json("Sentence audio file does not exist");
                }
              });
          });
        });
        
        res.status(200).json("Successfully deleted all audio recordiings for story"); 
    });
});

// Delete all messages with recipient id
recordingRoutes.route('/deleteStoryRecording/:id').get(function(req, res) {
    VoiceRecording.deleteMany({"storyData._id": req.params.id}, function(err, recordings) {
        if(err) res.json(err);
        else res.json("Successfully removed all voice recording objects for story");
    });
});




module.exports = recordingRoutes;
