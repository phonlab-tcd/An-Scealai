const express = require('express');
const app = express();
const storyRoutes = express.Router();

let Story = require('../models/Story');

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

module.exports = storyRoutes;