const express = require('express');
const app = express();
const storyRoutes = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let Story = require('../models/Story');

let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = client.db('an-scealai');
});

// Create new story
storyRoutes.route('/create').post(function (req, res) {
    let story = new Story(req.body);
    story.save().then(story => {
        res.status(200).json({'story': 'story added successfully'});

    })
    .catch(err => {
        res.status(400).send("unable to save to DB");
    });
});

// Get story by a given author from DB
storyRoutes.route('/:author').get(function (req, res) {
    Story.find({"author": req.params.author}, function (err, stories) {
    if(err) {
        console.log(err);
    } else {
        res.json(stories);
    }
    });
});

// Get story with a given ID from DB
storyRoutes.route('/viewStory/:id').get(function(req, res) {
    Story.find({_id:req.params.id}, (err, story) => {
        if(err) {
            res.json({"status" : err.status}, {"message" : err.message});
        } else {
            res.json(story);
        }
    });
});

// Update story by ID
storyRoutes.route('/update/:id').post(function (req, res) {
    Story.findOne({"id": req.params.id}, function(err, story) {
        if(err) res.json(err);
        if(story === null) {
            console.log("story is null!");
        } else {
            story.text = req.body.text;
            story.save().then(story => {
                res.json('Update complete');
            }).catch(err => {
                res.status(400).send("Unable to update");
            });
        }
    });
})

// Delete story by ID
storyRoutes.route('/delete/:id').get(function(req, res) {
    Story.findOneAndRemove({"id": req.params.id}, function(err, story) {
        if(err) res.json(err);
        else res.json("Successfully removed");
    });
});

storyRoutes.route('/feedback/:id').get(function(req, res) {
    Story.findById(req.params.id, (err, story) => {
        if(err) res.json(err);
        if(story) {
            res.json(story.feedback);
        } else {
            res.status(404).json({"message" : "Story does not exist"});
        }
    });
});

storyRoutes.route('/addFeedback/:id').post((req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(err) res.json(err);
        if(story) {
            story.feedback.text = req.body.feedback;
            story.feedback.seenByStudent = false;
            story.save();
            res.status(200).json({"message" : "Feedback added successfully"});
        } else {
            res.status(404).json({"message" : "Story does not exist"});
        }
    });
});

storyRoutes.route('/viewFeedback/:id').post((req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(err) res.json(err);
        if(story) {
            story.feedback.seenByStudent = true;
            story.save();
            res.status(200).json({"message" : "Feedback viewed successfully"});
        } else {
            res.status(404).json({"message" : "Story does not exist"});
        }
    });
})

storyRoutes.route('/feedbackAudio/:id').get((req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(err) res.json(err);
        if(story) {
            if(story.feedback.audioId) {
                var audioId;
                try {
                    audioId = new ObjectID(story.feedback.audioId);
                } catch(err) {
                    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
                }
            
                res.set('content-type', 'audio/mp3');
                res.set('accept-ranges', 'bytes');

                let bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'audioFeedback'
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
            } else {
                res.status(404).json({message:"No audio feedback has been associated with this story"});
            }
            
        } else {
            res.status(404).json({"message" : "Story does not exist"});
        }
    });
})

storyRoutes.route('/addFeedbackAudio/:id').post((req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(err) res.json(err);
        if(story) {
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
                    bucketName: 'audioFeedback'
                });

                let uploadStream = bucket.openUploadStream("audio-feedback-for-story-" + story._id.toString());
                story.feedback.audioId = uploadStream.id;
                story.save();
                readableTrackStream.pipe(uploadStream);

                uploadStream.on('error', () => {
                    return res.status(500).json({ message: "Error uploading file" });
                });

                uploadStream.on('finish', () => {
                    return res.status(201).json({ message: "File uploaded successfully, stored under Mongo"});
                });
            });
        } else {
            res.status(404).json({"message" : "Story does not exist"});
        }
    });
    
});

module.exports = storyRoutes;