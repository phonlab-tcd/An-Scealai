const mongodb = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');
const Story = require('../../models/story');


const config = require('../../DB');
const dbUrl = require('../../utils/dbUrl');

let db;
mongodb.MongoClient.connect(dbUrl,
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

// storyRoutes.route('/feedbackAudio/:id').get(
module.exports = async (req, res) => {
  if (! mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      invalidObjectId: req.params.id,
    });
  }
  Story.findById(req.params.id, (err, story) => {
    if (err) {
      console.log(err);
      res.status(404).json(err);
    } else if (story) {
      if (story.feedback.audioId) {
        let audioId;
        // get the audio id from the audio id set to the story
        try {
          audioId = new mongodb.ObjectID(story.feedback.audioId);
        } catch (err) {
          return res.status(400).json({
            message: 'Invalid trackID in URL parameter. ' +
            'Must be a single String of 12 bytes ' +
            'or a string of 24 hex characters'});
        }

        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');
        // get collection name for audio files
        const bucket = new mongodb.GridFSBucket(db, {
          bucketName: 'audioFeedback',
        });
        // create a new stream of file data using the bucket name
        const downloadStream = bucket.openDownloadStream(audioId);
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
        // res.status(404).json({
        //   message: "No audio feedback has been associated with this story"});
        res.json(null);
      }
    } else {
      res.status(404).json({message: 'Story does not exist'});
    }
  });
};
