"use strict";
var express = require('express');
var app = express();
var profileRoutes = express.Router();
var Profile = require('../models/profile');
profileRoutes.route('/create').post(function (req, res) {
    Profile.updateOne({ userId: req.body.userId }, req.body, { upsert: true }).then(function (upsertDetails) {
        res.status(200).send(upsertDetails);
    }).catch(function (err) {
        res.status(400).send(err);
    });
});
profileRoutes.route('/get/:id').get(function (req, res) {
    Profile.findById(req.params.id, function (err, profile) {
        if (err) {
            console.log(err);
            res.status(400).send("An error occurred while trying to find this profile");
        }
        else {
            if (profile) {
                res.status(200).json({ "profile": profile });
            }
            else {
                res.status(404).send("Profile with given ID not found");
            }
        }
    });
});
profileRoutes.route('/getForUser/:id').get(function (req, res) {
    Profile.findOne({ "userId": req.params.id }, function (err, profile) {
        if (err) {
            console.log(err);
            res.status(400).send("An error occurred while trying to find this profile");
        }
        if (!profile) {
            console.log(profile);
            res.status(404).send("Profile with given ID not found");
        }
        else {
            console.log(profile);
            res.status(200).json({ "profile": profile });
        }
    });
});
// Delete profile by user ID
profileRoutes.route('/deleteProfile/:id').get(function (req, res) {
    Profile.findOneAndRemove({ "userId": req.params.id }, function (err, profile) {
        if (err) {
            console.log(err);
            res.json(err);
        }
        else
            res.json("Successfully removed profile");
    });
});
module.exports = profileRoutes;
