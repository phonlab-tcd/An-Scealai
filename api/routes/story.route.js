const express = require('express');
const app = express();
const multer = require('multer');
const { Readable } = require('stream');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const querystring = require('querystring');
const request = require('request');
const { parse, stringify } = require('node-html-parser');
const makeEndpoints = require('../utils/makeEndpoints');
const getStoryById = require('../endpointsFunctions/story/getStoryById');

let Story = require('../models/story');
let Event = require('../models/event');

let db;
MongoClient.connect('mongodb://localhost:27017/', 
  {useUnifiedTopology: true, useNewUrlParser: true},
  (err, client) => {
    if (err) {
      console.log('MongoDB Connection Error in ./api/routes/story.route.js . Please make sure that MongoDB is running.');
      process.exit(1);
    }
    db = client.db('an-scealai');
  });

const storyRoutes = makeEndpoints({
  get: {
    '/getStoryById/:id': getStoryById,
  }
});

// Create new story
storyRoutes.route('/create').post(function (req, res) {
  let story = new Story(req.body);
  story.feedback.seenByStudent = null;
  story.feedback.text = null;
  story.feedback.audioId = null;
  story.save().then(story => {
    res.status(200).json({'story': 'story added successfully', 'id': story._id});
  })
    .catch(err => {
      console.log(err);
      res.status(400).send("unable to save story to DB");
    });
});

// Get story by a given author from DB
storyRoutes.route('/:author').get(function (req, res) {
  Story.find({"author": req.params.author}, function (err, stories) {
    if(err) {
      console.log(err);
      res.json(err)
    } else {
      res.json(stories);
    }
  });
});

// Get stories by a given author after a certain date from DB
storyRoutes.route('/getStoriesForClassroom/:author/:date').get(function (req, res) {
  Story.find({"author": req.params.author, date: {$gte: req.params.date}}, function (err, stories) {
    if(err) {
      console.log(err);
      res.json(err)
    } else {
      res.json(stories);
    }
  });
});

// Get story with a given ID from DB
storyRoutes.route('/viewStory/:id').get(function(req, res) {
  Story.find({_id:req.params.id}, (err, story) => {
    if(err) {
      console.log(err);
      res.status(400).json({"message" : err.message});
    } else {
      res.json(story);
    }
  });
});

// Update story by ID
storyRoutes.route('/update/:id').post(function (req, res) {
  Story.findById(req.params.id, function(err, story) {
    if(err) {
      console.log(err);
      res.json(err);
    }
    if(story === null) {
      console.log("story is null!");
    } else {

      if(req.body.text) {
        story.text = req.body.text;
      }
      if(req.body.htmlText) {
        story.htmlText = req.body.htmlText;
      }
      if(req.body.lastUpdated) {
        story.lastUpdated = req.body.lastUpdated;
      }
      if(req.body.dialect) {
        story.dialect = req.body.dialect;
      }
      if(req.body.title) {
        story.title = req.body.title;
      }

      story.save().then(story => {
        res.json('Update complete');
      }).catch(err => {
        res.status(400).send("Unable to update story");
      });
    }
  });
})

// Update story author
storyRoutes.route('/updateAuthor/:oldAuthor').post(function (req, res) {
  Story.updateMany({"author": req.params.oldAuthor}, { $set: { "author": req.body.newAuthor } }, function(err, stories) {
    if(err) res.json(err);

    if(stories === null) {
      console.log("story is null!");
    }
    else {
      res.json(stories);
    }
  });
})

// Delete story by ID
storyRoutes.route('/delete/:id').get(function(req, res) {
  Story.findOneAndRemove({_id: req.params.id}, function(err, story) {
    if(err) {
      console.log(err);
      res.json(err);
    }
    else res.json("Successfully removed story");
  });
});

// Delete story by student username
storyRoutes.route('/deleteAllStories/:author').get(function(req, res) {
  Story.deleteMany({"author": req.params.author}, function(err, story) {
    if(err) {
      console.log(err);
      res.json(err);
    }
    else res.json("Successfully removed all stories for user");
  });
});

storyRoutes.route('/feedback/:id').get(function(req, res) {
  Story.findById(req.params.id, (err, story) => {
    if(err) {
      console.log(err);
      res.json(err);
    }
    if(story) {
      res.json(story.feedback);
    } else {
      res.status(404).json({"message" : "Story does not exist"});
    }
  });
});

storyRoutes.route('/addFeedback/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if(err) {
      console.log(err);
      res.json(err);
    }
    if(story) {
      story.feedback.text = req.body.feedback;
      story.feedback.seenByStudent = false;
      story.save();
      res.status(200).json({"message" : "Feedback added successfully"});
    } else {
      res.status(404).json({"message" : "Story does not exist"});
    }
  });
});

storyRoutes.route('/viewFeedback/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if(err) {
      console.log(err);
      res.json(err);
    }
    if(story) {
      story.feedback.seenByStudent = true;
      story.save();
      res.status(200).json({"message" : "Feedback viewed successfully"});
    } else {
      res.status(404).json({"message" : "Story does not exist"});
    }
  });
});

storyRoutes.route('/feedbackAudio/:id').get((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if(err) {
      console.log(err);
      res.json(err);
    }
    if(story) {
      if(story.feedback.audioId) {
        var audioId;
        // get the audio id from the audio id set to the story
        try {
          audioId = new ObjectID(story.feedback.audioId);
        } catch(err) {
          return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
        }

        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');
        // get collection name for audio files
        let bucket = new mongodb.GridFSBucket(db, {
          bucketName: 'audioFeedback'
        });
        // create a new stream of file data using the bucket name
        let downloadStream = bucket.openDownloadStream(audioId);
        // write stream data to response if data is found
        downloadStream.on('data', (chunk) => {
          res.write(chunk);
        });

        downloadStream.on('error', () => {
          res.sendStatus(404);
        });
        // close the stream after data sent to response
        downloadStream.on('end', () => {
          res.end();
        });
      } else {
        //res.status(404).json({"message" : "No audio feedback has been associated with this story"});
        res.json(null);
      }

    } else {
      res.status(404).json({"message" : "Story does not exist"});
    }
  });
})

storyRoutes.route('/addFeedbackAudio/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if(err) {
      console.log(err);
      res.json(err);
    }
    if(story) {
      const storage = multer.memoryStorage();
      const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
      upload.single('audio')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: "Upload Request Validation Failed" });
        }
        // create new stream and push audio data
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
        // get bucket (collection) for storing audio file
        let bucket = new mongodb.GridFSBucket(db, {
          bucketName: 'audioFeedback'
        });
        // get audio file from collection and save id to story audio id
        let uploadStream = bucket.openUploadStream("audio-feedback-for-story-" + story._id.toString());
        story.feedback.audioId = uploadStream.id;
        story.save();
        // pipe data in stream to the audio file entry in the db 
        readableTrackStream.pipe(uploadStream);

        uploadStream.on('error', () => {
          return res.status(500).json({ message: "Error uploading file" });
        });

        uploadStream.on('finish', () => {
          return res.status(201).json({ message: "File uploaded successfully, stored under Mongo"});
        });
      });
    } else {
      res.status(404).json({"message" : "Story does not exist"});
    }
  });
});

storyRoutes.route('/updateActiveRecording/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if(story) {
      if (req.body.activeRecording) {
        story.activeRecording = req.body.activeRecording;
      }
      story.save().then(_ => {
        res.json('Update complete');
      }).catch(_ => {
        res.status(400).send("Unable to update");
      });
    } else {
      res.status(404).json({message: 'Story not found'});
    }
  });
});

/*
 * Synthesise a story given the story id 
 */
storyRoutes.route('/synthesise/:id').get((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if(story) {
      synthesiseStory(story).then(synthesis => {
        if (synthesis) {
          res.json(synthesis);
        } else {
          res.json({message: 'Synthesis failed :('});
        }
      });
    } else {
      res.json({status: '404', message: 'Story not found'});
    }
  });
});


/*
 * Synthesise a story object given in req.body
 */
storyRoutes.route('/synthesiseObject/').post((req, res) => {
  if (req.body.story) {
    synthesiseStory(req.body.story).then(synthesis => {
      if (synthesis) {
        res.json(synthesis);
      } else {
        res.json({message: 'Synthesis failed :('});
      }
    });
  } else {
    res.status(400).json({message: 'Story object must be provided in body.'});
  }
});

function synthesiseStory(story) {
  let dialectCode;
  if(story.dialect === 'connemara') dialectCode = 'ga_CM';
  if(story.dialect === 'donegal') dialectCode = 'ga_GD';
  if(story.dialect === 'kerry') dialectCode = 'ga_MU';

  // create a form with the story text, dialect choice, html, and speed
  /*
  console.log(story.text);
  let test8 = story.text.replace(/<br>/g, "\n");
  let test9 = test8.replace(/(<([^>]+)>)/gm,'');
  console.log("\nnew format: ", test8);
  console.log("\nnew format: ", test9);
  */

  let form = {
    //Input: test9,
    Input: story.text,
    Locale: dialectCode,
    Format: 'html',
    Speed: '1',
  };

  // turn form into a url query string
  let formData = querystring.stringify(form);
  let contentLength = formData.length;

  return new Promise((resolve, reject) => {
    // make a request to abair passing in the form data
    request({
      headers: {
        'Host' : 'www.abair.tcd.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function (err, resp, body) {
      if(err) res.send(err);
      if(body) {
        // audioContainer is chunk of text made up of paragraphs
        let audioContainer = parse(body).querySelectorAll('.audio_paragraph');
        let paragraphs = [];
        let urls = [];
        // loop through every paragraph and fill array of sentences
        for(let p of audioContainer) {
          let sentences = [];
          for(let s of p.childNodes) {
            // push the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            if(s.rawTagName === 'span') {
              sentences.push(s.toString());
            } 
            // push the audio ids for the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            else if(s.rawTagName === 'audio') {
              urls.push(s.id);
            }
          }
          paragraphs.push(sentences);
        }
        resolve({html : paragraphs, audio : urls });
      } else {
        reject();
      }
    });
  });
}

storyRoutes.route('/gramadoir/:id/:lang').get((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    console.log("story: ", story);
    if(err) {
      console.log(err);
      res.send(err);
    }
    if(story) {
      /*
      console.log("original text: ", story.text);
      let test8 = story.text.replace(/<br>/g, "\n");
      let test9 = test8.replace(/(<([^>]+)>)/ig, '');
      let test10 = test9.replace(/\n/g, " ");
      console.log("test8: ", test8);
      console.log("test9: ", test9);
      console.log("test10: ", test10);
      */
      let form = {
        teacs: story.text.replace(/\n/g, " "),
        teanga: req.params.lang,
      };

      let formData = querystring.stringify(form);

      request({headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
        //uri: 'https://cadhan.com/api/gramadoir/1.0',
        uri: 'https://www.abair.tcd.ie/cgi-bin/api-gramadoir-1.0.pl',
        body: formData,
        method: 'POST'
      }, (err, resp, body) => {
        if(err) res.send(err);
        if(body) {
          res.send(body);
        } else {
          res.sendStatus(404);
        }
      });

    } else {
      res.sendStatus(404).send("Story not found.");
    }
  });
})

module.exports = storyRoutes;
