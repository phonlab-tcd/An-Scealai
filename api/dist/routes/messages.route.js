"use strict";
var express = require('express');
var app = express();
var messageRoutes = express.Router();
var MongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var Readable = require('stream').Readable;
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var Message = require('../models/message');
var db;
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = client.db('an-scealai');
});
// Create new message in database
messageRoutes.route('/create').post(function (req, res) {
    var message = new Message(req.body);
    message.save().then(function (message) {
        res.status(200).json({ 'message': 'message added successfully' });
    })
        .catch(function (err) {
        res.status(400).send("unable to save to DB");
    });
});
// Get messages 
messageRoutes.route('/viewMessges/:id').get(function (req, res) {
    Message.find({ recipientId: req.params.id }, function (err, message) {
        if (err) {
            res.status(400).json({ "message": err.message });
        }
        else {
            res.json(message);
        }
    });
});
// Get message by id
messageRoutes.route('/getMessageById/:id').get(function (req, res) {
    Message.findOne({ id: req.params.id }, function (err, message) {
        if (err)
            res.json(err);
        if (message)
            res.json(message);
    });
});
// Set a message status to read
messageRoutes.route('/markAsOpened/:id').post(function (req, res) {
    Message.findById(req.params.id, function (err, message) {
        if (err)
            res.json(err);
        if (message) {
            message.seenByRecipient = true;
            message.save();
            res.status(200).json({ "message": "Message viewed successfully" });
        }
        else {
            res.status(404).json({ "message": "Message does not exist" });
        }
    });
});
// Update sender usernames for given user
messageRoutes.route('/updateSenderUsername/:id').post(function (req, res) {
    Message.find({ "senderId": req.params.id }, function (err, messages) {
        if (err) {
            res.status(400).json({ "message": err.message });
        }
        else {
            for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                var message = messages_1[_i];
                message.senderUsername = req.body.username;
                message.save().catch(function (err) {
                    res.status(400).send("Unable to update");
                });
            }
            res.json("Successfully updated message sender username");
        }
    });
});
// Delete message by ID
messageRoutes.route('/delete/:id').get(function (req, res) {
    Message.findOneAndRemove({ "id": req.params.id }, function (err, message) {
        if (err)
            res.json(err);
        else
            res.json("Successfully removed");
    });
});
// Delete all messages with recipient id
messageRoutes.route('/deleteAllMessages/:userId').get(function (req, res) {
    Message.deleteMany({ "recipientId": req.params.userId }, function (err, message) {
        if (err)
            res.json(err);
        else
            res.json("Successfully removed all messages for user");
    });
});
// Add audio message 
messageRoutes.route('/addMessageAudio/:id').post(function (req, res) {
    Message.findById(req.params.id, function (err, message) {
        if (err)
            res.json(err);
        if (message) {
            var storage = multer.memoryStorage();
            var upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 } });
            upload.single('audio')(req, res, function (err) {
                if (err) {
                    return res.status(400).json({ message: "Upload Request Validation Failed" });
                }
                var readableTrackStream = new Readable();
                readableTrackStream.push(req.file.buffer);
                readableTrackStream.push(null);
                var bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'audioMessage'
                });
                var uploadStream = bucket.openUploadStream("audio-for-message-" + message._id.toString());
                message.audioId = uploadStream.id;
                message.save();
                readableTrackStream.pipe(uploadStream);
                uploadStream.on('error', function () {
                    return res.status(500).json({ message: "Error uploading file" });
                });
                uploadStream.on('finish', function () {
                    return res.status(201).json({
                        message: "File uploaded successfully, stored under Mongo"
                    });
                });
            });
        }
        else {
            res.status(404).json({ "message": "Message does not exist" });
        }
    });
});
// Get audio messages 
messageRoutes.route('/messageAudio/:id').get(function (req, res) {
    Message.findById(req.params.id, function (err, message) {
        if (err)
            res.json(err);
        if (message) {
            if (message.audioId) {
                var audioId;
                try {
                    audioId = new ObjectID(message.audioId);
                }
                catch (err) {
                    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
                }
                res.set('content-type', 'audio/mp3');
                res.set('accept-ranges', 'bytes');
                var bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'audioMessage'
                });
                var downloadStream = bucket.openDownloadStream(audioId);
                downloadStream.on('data', function (chunk) {
                    res.write(chunk);
                });
                downloadStream.on('error', function () {
                    res.sendStatus(404);
                });
                downloadStream.on('end', function () {
                    res.end();
                });
            }
            else {
                res.status(404).json({ "message": "No audio feedback has been associated with this message" });
            }
        }
        else {
            res.status(404).json({ "message": "Message does not exist" });
        }
    });
});
// Delete audio message
messageRoutes.route('/deleteMessageAudio/:id').get(function (req, res) {
    Message.findOne({ id: req.params.id }, function (err, message) {
        if (err)
            return res.json(err);
        if (message) {
            if (message.audioId) {
                var audioId;
                try {
                    audioId = new ObjectID(message.audioId);
                }
                catch (err) {
                    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
                }
                var bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'audioMessage'
                });
                var downloadStream = bucket.delete(audioId);
                res.status(200).json({ "message": "Audio deleted successfully" });
            }
        }
        else {
            res.status(404).json({ "message": "Message does not exist" });
        }
    });
});
module.exports = messageRoutes;
