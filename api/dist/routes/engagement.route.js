"use strict";
var express = require('express');
var app = express();
var engagementRoutes = express.Router();
var MongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var Readable = require('stream').Readable;
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var Event = require('../models/event');
var User = require('../models/user');
var db;
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    }
    db = client.db('an-scealai');
});
engagementRoutes.route('/addEventForUser/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.json(err);
        }
        if (user) {
            if (req.body.event) {
                var event_1 = new Event();
                event_1.type = req.body.event.type;
                event_1.storyData = req.body.event.storyData;
                event_1.userId = user._id;
                event_1.date = new Date();
                event_1.save().then(function () {
                    res.status(200).json("Event added succesfully");
                });
            }
            else {
                res.status(400).json("Bad request, must include event object in request body");
            }
        }
        else {
            res.status(404).json("User does not exist");
        }
    });
});
engagementRoutes.route('/eventsForUser/:id').get(function (req, res) {
    Event.find({ 'userId': req.params.id }, function (err, events) {
        if (err) {
            res.json(err);
        }
        if (events) {
            res.status(200).json(events);
        }
        else {
            res.status(404).json("User does not have any events.");
        }
    });
});
engagementRoutes.route('/eventsForStory/:id').get(function (req, res) {
    Event.find({ "storyData._id": req.params.id }, function (err, events) {
        if (err) {
            res.json(err);
        }
        if (events) {
            res.status(200).json(events);
        }
        else {
            res.status(404).json("User does not have any events.");
        }
    });
});
module.exports = engagementRoutes;
