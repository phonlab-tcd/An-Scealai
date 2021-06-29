const express = require('express');
const app = express();
const profileRoutes = express.Router();

let Profile = require('../models/profile');

profileRoutes.route('/create').post((req, res) => {
  console.log("body: ", req.body)
    Profile.updateOne({userId : req.body.userId}, req.body, {upsert : true}).then(upsertDetails => {
        res.status(200).send(upsertDetails);
    }).catch(err => {
        res.status(400).send(err);
    });
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
    Profile.findOne({"userId" : req.params.id}, (err, profile) => {
      console.log("this function is read");
        if(err) {
          console.log(err);
          res.status(400).send("An error occurred while trying to find this profile");
        }
        if(!profile) {
          console.log(profile)
          res.status(404).send("Profile with given ID not found");  
        }
        else {
          console.log(profile)
          res.status(200).json({"profile" : profile});
        }
        
        
    });
});

// Delete profile by user ID
profileRoutes.route('/deleteProfile/:id').get(function(req, res) {
    Profile.findOneAndRemove({"userId": req.params.id}, function(err, profile) {
        if(err) {
          console.log(err);
          res.json(err);
        }
        else res.json("Successfully removed profile");
    });
});

module.exports = profileRoutes;