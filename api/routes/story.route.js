const multer = require('multer');
const {Readable} = require('stream');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const querystring = require('querystring');
const request = require('request');
const makeEndpoints = require('../utils/makeEndpoints');
const {parse} = require('node-html-parser');
const path = require('path');
const fs = require('fs'); // file system
const pandoc = require('node-pandoc-promise');
const abairBaseUrl = require('../abair_base_url');
const logger = require('../logger');
const Story = require('../models/story');


let storyRoutes;
// Immediately Invoked Function Expression.
// Scopes the imported functions to just this function
(() => {
  // ENDPOINT HANDLERS
  // GET
  const withId =
    require('../endpoints_functions/story/withId');
  // const myStudentsStory =
  //   require('../endpoints_functions/story/myStudentsStory');
  const ownerId =
    require('../endpoints_functions/story/ownerId');
  const author =
    require('../endpoints_functions/story/author');
  const feedbackAudio =
    require('../endpoints_functions/story/feedbackAudio');
  const countGrammarErrors =
    require('../endpoints_functions/story/countGrammarErrors');

  // POST
  const create =
    require('../endpoints_functions/story/create');
  const viewFeedback =
    require('../endpoints_functions/story/viewFeedback');
  const updateStoryAndCheckGrammar =
    require('../endpoints_functions/story/updateStoryAndCheckGrammar');
  const averageWordCount =
    require('../endpoints_functions/story/averageWordCount');
  const getStoriesByDate =
    require('../endpoints_functions/story/getStoriesByDate');

  storyRoutes = makeEndpoints({
    get: {
      '/withId/:id': withId,
      // '/myStudentsStory/:id': myStudentsStory,
      '/owner/:id': ownerId,
      '/:author': author,
      '/feedbackAudio/:id': feedbackAudio,
      '/countGrammarErrors/:id': countGrammarErrors,
    },
    post: {
      '/create': create,
      '/viewFeedback/:id': viewFeedback,
      '/updateStoryAndCheckGrammar': updateStoryAndCheckGrammar,
      '/averageWordCount/:studentId': averageWordCount,
      '/getStoriesByDate/:studentId': getStoriesByDate,
    },
  });
})();


/**
 * Get stories for a given user (owner) after a certain date
 * @param {Object} req params: User ID
 * @param {Object} req params: Date
 * @return {Object} List of stories
 */
storyRoutes.route('/getStoriesForClassroom/:owner/:date').get(function(req, res) {
  Story.find({'owner': req.params.owner, 'date': {$gte: req.params.date}}, function(err, stories) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json(stories);
    }
  });
});

/**
 * Get a story by ID
 * @param {Object} req params: Story ID
 * @return {Object} Story object
 */
storyRoutes.route('/viewStory/:id').get(function(req, res) {
  Story.find({_id: req.params.id}, (err, story) => {
    if (err) {
      console.log(err);
      res.status(400).json({'message': err.message});
    } else {
      res.json(story);
    }
  });
});

/**
 * Update story information
 * @param {Object} req params: Story ID
 * @param {Object} req body: new story data
 * @return {Object} Success or error message
 */
storyRoutes
    .route('/update/:id')
    .post((req, res) => {
      Story.findById(req.params.id, function(err, story) {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        if (story === null) {
          console.log('story is null!');
          return res.status(404).json('story not found');
        }
        if (req.body.text) {
          story.text = req.body.text;
        }
        if (req.body.htmlText) {
          story.htmlText = req.body.htmlText;
        }
        if (req.body.lastUpdated) {
          story.lastUpdated = req.body.lastUpdated;
        }
        if (req.body.dialect) {
          story.dialect = req.body.dialect;
        }
        if (req.body.title) {
          story.title = req.body.title;
        }
        if ( story.studentId) story.owner = story.studentId;
        story.save().then(
            (ok) => res.json('Update complete'),
            (err)=> res.status(400).json(err));
      });
    });

/**
 * Delete a story by ID
 * @param {Object} req params: Story ID
 * @return {Object} Success or error message
 */
storyRoutes.route('/delete/:id').get(function(req, res) {
  Story.findOneAndRemove({_id: req.params.id}, function(err, story) {
    if (err) {
      console.log(err);
      res.json(err);
    } else res.json('Successfully removed story');
  });
});

/**
 * Delete a story by owner ID
 * @param {Object} req params: User (owner) ID
 * @return {Object} Success or error message
 */
storyRoutes.route('/deleteAllStories/:id').get(function(req, res) {
  Story.deleteMany({'owner': req.params.id}, function(err, story) {
    if (err) {
      console.log(err);
      res.json(err);
    } else res.json('Successfully removed all stories for user');
  });
});

/**
 * Get feedback information for a particular story
 * @param {Object} req params: Story ID
 * @return {Object} Story feedback
 */
storyRoutes.route('/feedback/:id').get(function(req, res) {
  Story.findById(req.params.id, (err, story) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if (story) {
      res.json(story.feedback);
    } else {
      res.status(404).json({'message': 'Story does not exist'});
    }
  });
});

/**
 * Update feedback information for a particular story
 * @param {Object} req params: Story ID
 * @param {Object} req body: Feedback data
 * @return {Object} Success or error message
 */
storyRoutes.route('/addFeedback/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if (story) {
      story.feedback.text = req.body.feedback;
      story.feedback.seenByStudent = false;
      story.save();
      res.status(200).json({'message': 'Feedback added successfully'});
    } else {
      res.status(404).json({'message': 'Story does not exist'});
    }
  });
});

/**
 * Save feedback audio to the DB for a given story
 * @param {Object} req params: Story ID
 * @param {Object} req file: Audio file
 * @return {Object} Success or error message
 */
storyRoutes.route('/addFeedbackAudio/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if (story) {
      const storage = multer.memoryStorage();
      const upload = multer({storage: storage, limits: {fields: 1, fileSize: 6000000, files: 1, parts: 2}});
      upload.single('audio')(req, res, (err) => {
        if (err) {
          return res.status(400).json({message: 'Upload Request Validation Failed'});
        }
        // create new stream and push audio data
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
        // get bucket (collection) for storing audio file
        const bucket = new mongodb.GridFSBucket(mongoose.connection.db, {
          bucketName: 'audioFeedback',
        });
        // get audio file from collection and save id to story audio id
        const uploadStream = bucket.openUploadStream('audio-feedback-for-story-' + story._id.toString());
        story.feedback.audioId = uploadStream.id;
        story.feedback.seenByStudent = false;
        story.save();
        // pipe data in stream to the audio file entry in the db
        readableTrackStream.pipe(uploadStream);

        uploadStream.on('error', () => {
          return res.status(500).json({message: 'Error uploading file'});
        });

        uploadStream.on('finish', () => {
          return res.status(201).json({message: 'File uploaded successfully, stored under Mongo'});
        });
      });
    } else {
      res.status(404).json({'message': 'Story does not exist'});
    }
  });
});

/**
 * Update story audio recording ID
 * @param {Object} req params: Story ID
 * @param {Object} req body: active recording ID
 * @return {Object} Success or error message
 */
storyRoutes.route('/updateActiveRecording/:id').post((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if (err) {
      console.log(err);
      res.json(err);
    }
    if (story) {
      if (req.body.activeRecording) {
        story.activeRecording = req.body.activeRecording;
      }
      story.save().then((_) => {
        res.json('Update complete');
      }).catch((_) => {
        res.status(400).send('Unable to update');
      });
    } else {
      res.status(404).json({message: 'Story not found'});
    }
  });
});

/**
 * Download story in given format
 * @param {Object} req params: Story ID
 * @param {Object} req params: Download format
 * @return {Object} Downloaded story file
 */
storyRoutes.route('/downloadStory/:id/:format').get(async (req, res) => {
  try {
    logger.info({
      endpoint: '/story/downloadStory',
      params: req.params,
    });

    const story = await Story.findById(req.params.id);

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
          `storiesForDownload/${story._id}${req.params.format}`);

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

/**
* Synthesise a given story by ID
* @param {Object} req params: Story ID
* @return {Object} Synthesis data
*/
storyRoutes.route('/synthesise/:id').get((req, res) => {
  Story.findById(req.params.id, (err, story) => {
    if (story) {
      synthesiseStory(story).then((synthesis) => {
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

/**
* Synthesise a story object
* @param {Object} req body: Story data
* @return {Object} Synthesis data
*/
storyRoutes.route('/synthesiseObject/').post((req, res) => {
  if (req.body.story) {
    synthesiseStory(req.body.story).then((synthesis) => {
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

/**
 * Get the synthesis using story data
 * @param {Object} story
 * @return {Object} HTML and audio data
 */
function synthesiseStory(story) {
  let dialectCode;
  if (story.dialect === 'connemara') dialectCode = 'ga_CM';
  if (story.dialect === 'donegal') dialectCode = 'ga_GD';
  if (story.dialect === 'kerry') dialectCode = 'ga_MU';

  const form = {
    // Input: test9,
    Input: story.text,
    Locale: dialectCode,
    Format: 'html',
    Speed: '1',
  };

  // turn form into a url query string
  const formData = querystring.stringify(form);
  const contentLength = formData.length;

  return new Promise((resolve, reject) => {
    // make a request to abair passing in the form data
    request({
      headers: {
        'Host': 'www.abair.ie',
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // uri: 'https://www.abair.tcd.ie/webreader/synthesis',
      uri: abairBaseUrl + '/webreader/synthesis',
      body: formData,
      method: 'POST',
    }, function(err, resp, body) {
      if (err) resp.send(err);
      if (body) {
        // audioContainer is chunk of text made up of paragraphs
        const audioContainer = parse(body).querySelectorAll('.audio_paragraph');
        const paragraphs = [];
        const urls = [];
        // loop through every paragraph and fill array of sentences
        for (const p of audioContainer) {
          const sentences = [];
          for (const s of p.childNodes) {
            // push the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            if (s.rawTagName === 'span') {
              sentences.push(s.toString());
            }
            // push the audio ids for the sentences
            // s.rawTagName <--> s.tagName if synthesis text not appearing
            else if (s.rawTagName === 'audio') {
              urls.push(s.id);
            }
          }
          paragraphs.push(sentences);
        }
        resolve({html: paragraphs, audio: urls});
      } else {
        reject();
      }
    });
  });
}

/**
 * Get An Gramadoir data for a given story  -- DEPRICATED ?
 * @param {Object} req params: Story ID
 * @return {Object} Grammar error tags
 */
storyRoutes.route('/gramadoir/:id/:lang').get((req, res) => {
  Story.findById(req.params.id, (err, story) => {
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
