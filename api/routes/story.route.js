const express = require('express');
const app = express();
const storyRoutes = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const querystring = require('querystring');
const request = require('request');
const { parse, stringify } = require('node-html-parser');

let Story = require('../models/story');

let db;
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  }
  db = client.db('an-scealai');
});

storyRoutes.route('/getStoryById/:id').get((req, res) => {
    Story.findOne({id: req.params.id}, (err, story) => {
        if(err) res.json(err);
        if(story) res.json(story);
    });
});

storyRoutes.route('/getStoryByUnderscoreId/:id').get((req, res) => {
    Story.findOne({_id: req.params.id}, (err, story) => {
        if(err) res.json(err);
        if(story) res.json(story);
    });
});

// Create new story
storyRoutes.route('/create').post(function (req, res) {
    let story = new Story(req.body);
    story.feedback.seenByStudent = null;
    story.feedback.text = null;
    story.feedback.audioId = null;
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
            res.status(400).json({"message" : err.message});
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
            
            if(req.body.text) {
                story.text = req.body.text;
            }
            if(req.body.date) {
                story.date = req.body.date;
            }
            if(req.body.dialect) {
                story.dialect = req.body.dialect;
            }
            if(req.body.title) {
                story.title = req.body.title;
            }
            
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

storyRoutes.route('/synthesise/:id').get((req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(story) {
            let dialectCode;
            if(story.dialect === 'connemara') dialectCode = 'ga_CM';
            if(story.dialect === 'donegal') dialectCode = 'ga_GD';
            if(story.dialect === 'kerry') dialectCode = 'ga_MU';

            let form = {
                Input: story.text,
                Locale: dialectCode,
                Format: 'html',
                Speed: '1',
            };

            let formData = querystring.stringify(form);
            let contentLength = formData.length;

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
                    res.json({ html : paragraphs, audio : urls });
                } else {
                    res.json({status: '404', message: 'No response from synthesiser'});
                }
            });
        } else {
            res.json({status: '404', message: 'Story not found'});
        }
    });
});

storyRoutes.route('/gramadoir/:id/:lang').get((req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(err) {
            res.send(err);
        }
        if(story) {
            let form = {
                teacs: story.text.replace(/\n/g, " "),
                teanga: req.params.lang,
            };

            let formData = querystring.stringify(form);

            request({headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                uri: 'https://cadhan.com/api/gramadoir/1.0',
                body: formData,
                method: 'POST'
            }, (err, resp, body) => {
                if(err) res.send(err);
                if(body) {
                    res.send(body);
                } else {
                    res.sendStatus(404);
                }
            });

        } else {
            res.sendStatus(404).send("Story not found.");
        }
    });
})

module.exports = storyRoutes;