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

module.exports = storyRoutes;