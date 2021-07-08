"use strict";
var express = require('express');
var app = express();
var recordingRoutes = express.Router();
var MongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var Readable = require('stream').Readable;
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var querystring = require('querystring');
var request = require('request');
var _a = require('node-html-parser'), parse = _a.parse, stringify = _a.stringify;
var logger = require('../logger.js');
var VoiceRecording = require('../models/recording');
var User = require('../models/user');
var db;
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.log('MongoDB Connection Error in ./api/routes/recording.route.js . Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = client.db('an-scealai');
});
recordingRoutes.route('/create').post(function (req, res) {
    var recording = new VoiceRecording(req.body);
    recording.save().then(function (_) {
        res.status(200).json({ "message": "Recording created successfully", "recording": recording });
    }).catch(function (err) {
        console.log(err);
        res.status(400).send("Unable to save to DB");
    });
});
recordingRoutes.route('/:id').get(function (req, res) {
    VoiceRecording.findById(req.params.id, function (err, recording) {
        if (err) {
            console.log(err);
            res.status(400).json({ "message": err.message });
        }
        else {
            res.json(recording);
        }
    });
});
// Update the audio ids and indices for a given recording
recordingRoutes.route('/updateTracks/:id').post(function (req, res) {
    VoiceRecording.findById(req.params.id, function (err, recording) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (recording) {
            var bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'voiceRecording'
            });
            logger.info("Request Paragraph audio ids: ", req.body.paragraphAudioIds);
            logger.info("Request Paragraph indices: ", req.body.paragraphIndices);
            logger.info("\nStored Paragraph audio ids: ", recording.paragraphAudioIds);
            logger.info("Stored Paragraph indices: ", recording.paragraphIndices);
            if (req.body.paragraphAudioIds) {
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
            if (req.body.paragraphIndices) {
                recording.paragraphIndices = req.body.paragraphIndices;
            }
            if (req.body.sentenceAudioIds) {
                recording.sentenceAudioIds = req.body.sentenceAudioIds;
            }
            if (req.body.sentenceIndices) {
                recording.sentenceIndices = req.body.sentenceIndices;
            }
            recording.save().then(function (_) {
                res.json('Update complete');
            }).catch(function (_) {
                res.status(400).send("Unable to update");
            });
        }
    });
});
recordingRoutes.route('/saveAudio/:storyId/:index/:uuid').post(function (req, res) {
    var storage = multer.memoryStorage();
    var upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 } });
    upload.single('audio')(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Upload Request Validation Failed" });
        }
        // create new stream and push audio data
        var readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
        // get bucket (collection) for storing audio file
        var bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'voiceRecording'
        });
        // get audio file from collection and save id to story audio id
        var fileId = "voice-rec-" + req.params.storyId.toString() + "-" + req.params.uuid.toString();
        var uploadStream = bucket.openUploadStream(fileId);
        // pipe data in stream to the audio file entry in the db 
        readableTrackStream.pipe(uploadStream);
        uploadStream.on('error', function () {
            return res.status(500).json({ message: "Error uploading file" });
        });
        uploadStream.on('finish', function () {
            return res.status(201).json({ message: "File uploaded successfully, stored under Mongo", fileId: uploadStream.id, index: req.params.index });
        });
    });
});
recordingRoutes.route('/audio/:id').get(function (req, res) {
    var audioId;
    // get the audio id from the audio id set to the story
    try {
        audioId = new ObjectID(req.params.id);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
    }
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    // get collection name for audio files
    var bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'voiceRecording'
    });
    // create a new stream of file data using the bucket name
    var downloadStream = bucket.openDownloadStream(audioId);
    // write stream data to response if data is found
    downloadStream.on('data', function (chunk) {
        res.write(chunk);
    });
    downloadStream.on('error', function () {
        res.sendStatus(404);
    });
    // close the stream after data sent to response
    downloadStream.on('end', function () {
        res.end();
    });
});
recordingRoutes.route('/getHistory/:storyId').get(function (req, res) {
    VoiceRecording.find({ "storyData._id": req.params.storyId, "archived": true }, function (err, recordings) {
        if (err) {
            console.log(err);
            res.status(400).json({ "message": err.message });
        }
        else {
            res.json(recordings);
        }
    });
});
recordingRoutes.route('/updateArchiveStatus/:recordingId').get(function (req, res) {
    VoiceRecording.findById(req.params.recordingId, function (err, recording) {
        if (err) {
            console.log(err);
            res.status(400).json({ "message": err.message });
        }
        else {
            recording.archived = true;
            recording.save();
        }
    });
});
// Delete audio recordings for story
recordingRoutes.route('/deleteStoryRecordingAudio/:id').get(function (req, res) {
    VoiceRecording.find({ "storyData._id": req.params.id }, function (err, recordings) {
        if (err)
            res.status(400).json(err);
        if (!recordings) {
            res.status(404).json({ "message": "Voice Recording does not exist" });
        }
        var bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'voiceRecording'
        });
        recordings.forEach(function (recording) {
            recording.paragraphAudioIds.forEach(function (paragraphAudioId) {
                bucket.delete(new ObjectID(paragraphAudioId), function (err) {
                    if (err) {
                        //console.log("File does not exist");
                        res.status(404).json("Paragraph audio file does not exist");
                    }
                });
            });
            recording.sentenceAudioIds.forEach(function (sentenceAudioId) {
                bucket.delete(new ObjectID(sentenceAudioId), function (err) {
                    if (err) {
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
recordingRoutes.route('/deleteStoryRecording/:id').get(function (req, res) {
    VoiceRecording.deleteMany({ "storyData._id": req.params.id }, function (err, recordings) {
        if (err)
            res.json(err);
        else
            res.json("Successfully removed all voice recording objects for story");
    });
});
module.exports = recordingRoutes;
