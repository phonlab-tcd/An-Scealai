const express = require('express');
const multer = require('multer');
const {Readable} = require('stream');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const querystring = require('querystring');
const request = require('request');
const passport = require('passport');
const makeEndpoints = require('../utils/makeEndpoints');
const { parse, stringify } = require('node-html-parser');
const path = require('path');
const fs = require('fs'); // file system
const pandoc = require('node-pandoc-promise');
const abairBaseUrl = require('../abair_base_url');
const logger = require('../logger');
const dbUrl = require('../utils/dbUrl');

const config = require('../DB');
const Story = require('../models/story');
const { jwtmw } = require('../utils/authMiddleware');
const ep = require('../utils/requireFromEndpointsFunctions');

let db;
MongoClient.connect(dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.log(
            'MongoDB Connection Error in ./api/routes/story.route.js\t\t' +
            'Please make sure that MongoDB is running.');
        process.exit(1);
      }
      db = client.db(process.env.DB || config.DB);
    });


const storyRoutes = express.Router();
storyRoutes.use(jwtmw);

////////////////////////////////////////// GET
storyRoutes
  .route('/viewStory/:id')
  .get(ep('/story/viewStory'));

storyRoutes
  .route('/getStoryById/:id')
  .get(ep('/story/getStoryById'));

storyRoutes
  .route('/feedbackAudio/:id')
  .get(ep('/story/feedbackAudio'));

storyRoutes
  .route('/:author')
  .get(ep('/story/:author'));
  
storyRoutes
  .route('/getStoriesForClassroom/:author/:date')
  .get(ep('/story/getStoriesForClassroom'));

////////////////////////////////////////// POST
storyRoutes
  .route('/viewFeedback/:id')
  .post(ep('/story/viewFeedback'));

storyRoutes
  .route('/updateStoryAndCheckGrammar')
  .post(ep('/story/updateStoryAndCheckGrammar'));

// Update story by ID
storyRoutes
  .route('/update/:id')
  .post(ep('/story/update'));

////////////////////////////////////////// PUT
storyRoutes
  .route('/create')
  .put(ep('/story/create'));


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

storyRoutes
    .route('/downloadStory/:id/:format')
    .get(async (req, res) => {
      try {
        logger.info({
          endpoint: '/story/downloadStory',
          params: req.params,
        });

        const story =
          await Story.findById(req.params.id);

        if (!story) {
          return res.status(404)
              .json({
                message: 'Story does not exist',
              });
        }

	console.dir(story);

        // GENERATE A FILENAME <story._id>.<format>
        const filename =
          path.join(
              __dirname,
              `storiesForDownload/${story._id}.${req.params.format}`);
	
	console.log(filename);

        logger.info({
          msg: 'CREATING ' + req.params.format,
          filename: filename,
          story: story,
        });

        // Pandoc example
        const pandocErr =
          await pandoc(
              story.htmlText || story.text, // src
              ['--from', 'html', '-o', filename]); // args

        if (pandocErr) {
          return res.json({
            pandocError: pandocErr,
          });
        }

        // SEND THE FILE CREATED WITH PANDOC
        res.sendFile(filename, (sendFileErr) => {
          if (sendFileErr) {
            logger.error({
              endpoint: '/story/downloadStory',
              while: 'sending the file:' + filename,
              error: sendFileErr,
            });
	    return res.send(sendFileErr);
          }
          // DELETE THE FILE AFTER IT HAS BEEN SENT
          fs.unlink(filename, (err) => {
            if (err) {
              logger.error({
                endpoint: '/story/downloadStory',
                while: 'trying to delete file:' + filename,
                error: err,
              });
            }
          });
        });
      } catch (error) {
        console.dir(error);
        logger.error(error);
        return res.json(error);
      }
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
        'Host' : 'www.abair.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      uri: abairBaseUrl + '/webreader/synthesis',
      body: formData,
      method: 'POST'
    }, function (err, resp, body) {
      if(err) resp.send(err);
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
    console.log('story: ', story);
    if (err) {
      console.log(err);
      return res.send(err);
    }
    if (story) {
      const form = {
        teacs: story.text.replace(/\n/g, ' '),
        teanga: req.params.lang,
      };

      const formData = querystring.stringify(form);

      logger.info('formData: ' + formData);
      request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // uri: 'https://cadhan.com/api/gramadoir/1.0',
        uri: abairBaseUrl + '/cgi-bin/api-gramadoir-1.0.pl',
        body: formData,
        method: 'POST',
      }, (err, resp, body) => {
        if (err) {
          return res.status(
            err.statusCode ? err.statusCode : 500)
              .send(err);
        } else if (body) {
          return res.json({
            text: story.text,
            grammarTags: body,
          });
        } else {
          return res.send(resp);
        }
      });
    } else {
      res.status(404).send('Story not found.');
    }
  });
});


module.exports = storyRoutes;
