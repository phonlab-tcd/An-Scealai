const express = require('express');
const app = express();
const storyRoutes = express.Router();

let Story = require('../models/Story');

storyRoutes.route('/save').post(function (req, res) {
    let story = new Story(req.body);
    story.save().then(story => {
        res.status(200).json({'story': 'story added successfully'});
    })
    .catch(err => {
        res.status(400).send("unable to save to DB");
    });
});

storyRoutes.route('/').get(function (req, res) {
    Story.find(function (err, stories) {
    if(err) {
        console.log(err);
    } else {
        res.json(stories);
    }
    });
});

storyRoutes.route('/update/:id').post(function (req, res) {
    Story.findOne({"id": req.params.id}, function(err, story) {
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

module.exports = storyRoutes;