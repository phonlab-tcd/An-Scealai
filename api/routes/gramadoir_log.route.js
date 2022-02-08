const express = require('express');
const mongoose = require('mongoose');
const app = express();
const gramadoirRoutes = express.Router();

const { GramadoirCache, GramadoirStoryHistory } = require('../models/gramadoir');

// Create new stat entry in database
gramadoirRoutes.route('/insert').post((req, res) => {
  console.dir(req.body.tagData);
  GramadoirCache.findOneAndUpdate(
    { text: req.body.text },
    { grammarTags: req.body.tagData},
    { upsert: true, new: true },
    (err,doc)=>{
      console.log(doc._id);
      GramadoirStoryHistory.findOneAndUpdate(
        { ownerId: mongoose.mongo.ObjectId(req.body.userUnderscoreId),
          storyId: mongoose.mongo.ObjectId(req.body.storyUnderscoreId), },
        { $push:
          {versions:
            { gramadoirCacheId: doc._id,
              timestamp: req.body.date || new Date(),
            }
          }
        },
        { upsert: true, new: true },
        (err,doc)=>{
          console.log(doc.versions);
        }
      );
    });
  res.send('hello');
});

module.exports = gramadoirRoutes;
