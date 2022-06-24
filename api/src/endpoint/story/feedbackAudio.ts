import Story from '../../model/story';
import mongoose from 'mongoose';
import Express from 'express';
import Mongoose from 'mongoose';
const { GridFSBucket, ObjectId } = require('mongodb');

type mwargs = [Express.Request, Express.Response, Function];
type mw = (...args:mwargs)=>any;

const dbConnection = ()=>mongoose.connection.db;
const bucketName = 'audioFeedback';
const audioFeedbackBucket = ()=>new GridFSBucket(dbConnection(),{bucketName});

// storyRoutes.route('/feedbackAudio/:id').get(
const get: mw = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      invalidObjectId: req.params.id,
    });
  }
  Story.findById(req.params.id, (err: any, story: any) => {
    if (err) {
      console.error(err);
      res.status(404).json(err);
    } else if (story) {
      if (story.feedback.audioId) {
        let audioId;
        // get the audio id from the audio id set to the story
        try {
          audioId = ObjectId(story.feedback.audioId);
        } catch (err) {
          console.error(err);
          return res.status(400).json({
            message: 'Invalid trackID in URL parameter. ' +
            'Must be a single String of 12 bytes ' +
            'or a string of 24 hex characters'});
        }

        res.set('content-type', 'audio/mp3');
        res.set('accept-ranges', 'bytes');
        // get collection name for audio files
        const bucket = audioFeedbackBucket();
        // create a new stream of file data using the bucket name
        const downloadStream = bucket.openDownloadStream(audioId);
        downloadStream.on('data',  (d:any)=>res.write(d));
        downloadStream.on('error',()=>res.sendStatus(404));
        downloadStream.on('end',  ()=>res.end());
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

module.exports = get;
