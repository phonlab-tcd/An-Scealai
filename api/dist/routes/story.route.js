"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var app = express();
var storyRoutes = express.Router();
var multer = require('multer');
var Readable = require('stream').Readable;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var querystring = require('querystring');
var request = require('request');
var _a = require('node-html-parser'), parse = _a.parse, stringify = _a.stringify;
var Story = require('../models/story');
var Event = require('../models/event');
var APIError = require('../utils/APIError');
var db;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) {
        console.log('MongoDB Connection Error in ./api/routes/story.route.js . Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = client.db('an-scealai');
});
var handle = {
    get: {},
    post: {},
};
handle.get['getStoryById/:id'] = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var story;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Story.findById(req.params.id)];
            case 1:
                story = _a.sent();
                if (!story) {
                    throw new APIError("Story with id " + req.params.id + " not found.", 404);
                }
                console.log('sending story:');
                console.dir(story);
                return [2 /*return*/, res.status(200).json(story)];
        }
    });
}); };
// Get story by a given author from DB
handle.get['/:author'] = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Story.find({
                    'author': req.params.author,
                }, function (err, stories) {
                    if (err) {
                        console.log(err);
                        throw new APIError('Could not retrieve stories with author: ' + req.params.author, 404);
                    }
                    else {
                        res.json(stories);
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var _loop_1 = function (endpointSuffix) {
    storyRoutes.route(endpointSuffix).get(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    logger.info(req);
                    return [4 /*yield*/, handle.get[endpointSuffix](req, res)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
for (var _i = 0, _b = Object.getOwnPropertyNames(handle.get); _i < _b.length; _i++) {
    var endpointSuffix = _b[_i];
    _loop_1(endpointSuffix);
}
// Create new story
storyRoutes.route('/create').post(function (req, res) {
    var story = new Story(req.body);
    story.feedback.seenByStudent = null;
    story.feedback.text = null;
    story.feedback.audioId = null;
    story.save().then(function (story) {
        res.status(200).json({ 'story': 'story added successfully', 'id': story._id });
    })
        .catch(function (err) {
        console.log(err);
        res.status(400).send("unable to save story to DB");
    });
});
// Get story with a given ID from DB
storyRoutes.route('/viewStory/:id').get(function (req, res) {
    Story.find({ _id: req.params.id }, function (err, story) {
        if (err) {
            console.log(err);
            res.status(400).json({ "message": err.message });
        }
        else {
            res.json(story);
        }
    });
});
// Update story by ID
storyRoutes.route('/update/:id').post(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story === null) {
            console.log("story is null!");
        }
        else {
            if (req.body.text) {
                story.text = req.body.text;
            }
            if (req.body.lastUpdated) {
                story.lastUpdated = req.body.lastUpdated;
            }
            if (req.body.dialect) {
                story.dialect = req.body.dialect;
            }
            if (req.body.title) {
                story.title = req.body.title;
            }
            story.save().then(function (story) {
                res.json('Update complete');
            }).catch(function (err) {
                res.status(400).send("Unable to update story");
            });
        }
    });
});
// Update story author
storyRoutes.route('/updateAuthor/:oldAuthor').post(function (req, res) {
    Story.updateMany({ "author": req.params.oldAuthor }, { $set: { "author": req.body.newAuthor } }, function (err, stories) {
        if (err)
            res.json(err);
        if (stories === null) {
            console.log("story is null!");
        }
        else {
            res.json(stories);
        }
    });
});
// Delete story by ID
storyRoutes.route('/delete/:id').get(function (req, res) {
    Story.findOneAndRemove({ _id: req.params.id }, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        else
            res.json("Successfully removed story");
    });
});
// Delete story by student username
storyRoutes.route('/deleteAllStories/:author').get(function (req, res) {
    Story.deleteMany({ "author": req.params.author }, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        else
            res.json("Successfully removed all stories for user");
    });
});
storyRoutes.route('/feedback/:id').get(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story) {
            res.json(story.feedback);
        }
        else {
            res.status(404).json({ "message": "Story does not exist" });
        }
    });
});
storyRoutes.route('/addFeedback/:id').post(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story) {
            story.feedback.text = req.body.feedback;
            story.feedback.seenByStudent = false;
            story.save();
            res.status(200).json({ "message": "Feedback added successfully" });
        }
        else {
            res.status(404).json({ "message": "Story does not exist" });
        }
    });
});
storyRoutes.route('/viewFeedback/:id').post(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story) {
            story.feedback.seenByStudent = true;
            story.save();
            res.status(200).json({ "message": "Feedback viewed successfully" });
        }
        else {
            res.status(404).json({ "message": "Story does not exist" });
        }
    });
});
storyRoutes.route('/feedbackAudio/:id').get(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story) {
            if (story.feedback.audioId) {
                var audioId;
                // get the audio id from the audio id set to the story
                try {
                    audioId = new ObjectID(story.feedback.audioId);
                }
                catch (err) {
                    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
                }
                res.set('content-type', 'audio/mp3');
                res.set('accept-ranges', 'bytes');
                // get collection name for audio files
                var bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'audioFeedback'
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
            }
            else {
                //res.status(404).json({"message" : "No audio feedback has been associated with this story"});
                res.json(null);
            }
        }
        else {
            res.status(404).json({ "message": "Story does not exist" });
        }
    });
});
storyRoutes.route('/addFeedbackAudio/:id').post(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story) {
            var storage = multer.memoryStorage();
            var upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 } });
            upload.single('audio')(req, res, function (err) {
                if (err) {
                    return res.status(400).json({ message: "Upload Request Validation Failed" });
                }
                // create new stream and push audio data
                var readableTrackStream = new Readable();
                readableTrackStream.push(req.file.buffer);
                readableTrackStream.push(null);
                // get bucket (collection) for storing audio file
                var bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'audioFeedback'
                });
                // get audio file from collection and save id to story audio id
                var uploadStream = bucket.openUploadStream("audio-feedback-for-story-" + story._id.toString());
                story.feedback.audioId = uploadStream.id;
                story.save();
                // pipe data in stream to the audio file entry in the db 
                readableTrackStream.pipe(uploadStream);
                uploadStream.on('error', function () {
                    return res.status(500).json({ message: "Error uploading file" });
                });
                uploadStream.on('finish', function () {
                    return res.status(201).json({ message: "File uploaded successfully, stored under Mongo" });
                });
            });
        }
        else {
            res.status(404).json({ "message": "Story does not exist" });
        }
    });
});
storyRoutes.route('/updateActiveRecording/:id').post(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        if (story) {
            if (req.body.activeRecording) {
                story.activeRecording = req.body.activeRecording;
            }
            story.save().then(function (_) {
                res.json('Update complete');
            }).catch(function (_) {
                res.status(400).send("Unable to update");
            });
        }
        else {
            res.status(404).json({ message: 'Story not found' });
        }
    });
});
/*
 * Synthesise a story given the story id
 */
storyRoutes.route('/synthesise/:id').get(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        if (story) {
            synthesiseStory(story).then(function (synthesis) {
                if (synthesis) {
                    res.json(synthesis);
                }
                else {
                    res.json({ message: 'Synthesis failed :(' });
                }
            });
        }
        else {
            res.json({ status: '404', message: 'Story not found' });
        }
    });
});
/*
 * Synthesise a story object given in req.body
 */
storyRoutes.route('/synthesiseObject/').post(function (req, res) {
    if (req.body.story) {
        synthesiseStory(req.body.story).then(function (synthesis) {
            if (synthesis) {
                res.json(synthesis);
            }
            else {
                res.json({ message: 'Synthesis failed :(' });
            }
        });
    }
    else {
        res.status(400).json({ message: 'Story object must be provided in body.' });
    }
});
function synthesiseStory(story) {
    var dialectCode;
    if (story.dialect === 'connemara')
        dialectCode = 'ga_CM';
    if (story.dialect === 'donegal')
        dialectCode = 'ga_GD';
    if (story.dialect === 'kerry')
        dialectCode = 'ga_MU';
    // create a form with the story text, dialect choice, html, and speed
    var form = {
        Input: story.text,
        Locale: dialectCode,
        Format: 'html',
        Speed: '1',
    };
    // turn form into a url query string
    var formData = querystring.stringify(form);
    var contentLength = formData.length;
    return new Promise(function (resolve, reject) {
        // make a request to abair passing in the form data
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
                // audioContainer is chunk of text made up of paragraphs
                var audioContainer = parse(body).querySelectorAll('.audio_paragraph');
                var paragraphs = [];
                var urls = [];
                // loop through every paragraph and fill array of sentences
                for (var _i = 0, audioContainer_1 = audioContainer; _i < audioContainer_1.length; _i++) {
                    var p = audioContainer_1[_i];
                    var sentences = [];
                    for (var _a = 0, _b = p.childNodes; _a < _b.length; _a++) {
                        var s = _b[_a];
                        // push the sentences
                        // s.rawTagName <--> s.tagName if synthesis text not appearing
                        if (s.rawTagName === 'span') {
                            sentences.push(s.toString());
                        }
                        // push the audio ids for the sentences
                        // s.rawTagName <--> s.tagName if synthesis text not appearing
                        else if (s.rawTagName === 'audio') {
                            urls.push(s.id);
                        }
                    }
                    paragraphs.push(sentences);
                }
                resolve({ html: paragraphs, audio: urls });
            }
            else {
                reject();
            }
        });
    });
}
storyRoutes.route('/gramadoir/:id/:lang').get(function (req, res) {
    Story.findById(req.params.id, function (err, story) {
        console.log("story: ", story);
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (story) {
            var form = {
                teacs: story.text.replace(/\n/g, " "),
                teanga: req.params.lang,
            };
            var formData = querystring.stringify(form);
            request({ headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                //uri: 'https://cadhan.com/api/gramadoir/1.0',
                uri: 'https://www.abair.tcd.ie/cgi-bin/api-gramadoir-1.0.pl',
                body: formData,
                method: 'POST'
            }, function (err, resp, body) {
                if (err)
                    res.send(err);
                if (body) {
                    res.send(body);
                }
                else {
                    res.sendStatus(404);
                }
            });
        }
        else {
            res.sendStatus(404).send("Story not found.");
        }
    });
});
module.exports = storyRoutes;
