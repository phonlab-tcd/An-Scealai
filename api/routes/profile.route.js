const express = require('express');
const app = express();
const profileRoutes = express.Router();

let Profile = require('../models/profile');

profileRoutes.route('/create').post((req, res) => {
    Profile.updateOne({userId : req.body.userId}, req.body, {upsert : true}).then(upsertDetails => {
        res.status(200).send(upsertDetails);
    }).catch(err => {
        res.status(400).send(err);
    });
});

profileRoutes.route('/get/:id').get((req, res) => {
    Profile.findById(req.params.id, (err, profile) => {
        if(err) {
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

module.exports = profileRoutes;