const { ObjectId } = require('bson');
const express = require('express');
const profileRoutes = express.Router();

let Profile = require('../models/profile');

profileRoutes.route('/create').post((req, res) => {
    req.body.owner = new ObjectId(req.user._id);
    Profile.updateOne({userId : req.user._id}, req.body, {upsert : true})
        .then(  upsertDetails=>res.status(200).send(upsertDetails),
                err          =>res.status(400).send(err));
});

profileRoutes.route('/get/:id').get((req, res) => {
    Profile.findById(req.params.id, (err, profile) => {
        if(err) {
            console.log(err);
            res.status(400).send("An error occurred while trying to find this profile");
        } else {
            if(profile) {
                res.status(200).json({"profile" : profile});
            } else {
                res.status(404).send("Profile with given ID not found");
            }
        }
    });
});

profileRoutes.route('/getForUser/:id').get((req, res) => {
    Profile.findOne({"userId" : req.user._id})
      .then(
        profile => res.status(profile ? 200 : 404).json({profile}),
        err     => res.status(400).send("An error occurred while trying to find this profile"),
      );
});

// Delete profile by user ID
profileRoutes.route('/deleteProfile/:id').get(function(req, res) {
    Profile.findOneAndRemove({"userId": req.user._id}, function(err, profile) {
        if(err) {
          console.log(err);
          res.json(err);
        }
        else res.json("Successfully removed profile");
    });
});

module.exports = profileRoutes;