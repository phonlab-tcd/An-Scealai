const express = require('express');
const recordingRoutes = express.Router();
const multer = require('multer');
const ObjectID = require('mongodb').ObjectID;
const logger = require('../logger.js');

let VoiceRecording = require('../models/recording');

const voiceRecording = require('../utils/voiceRecording');

recordingRoutes.route('/create').post((req, res) => {
    const recording = new VoiceRecording(req.body);
    recording.save().then(_ => {
        res.status(200).json({"message" : "Recording created successfully", "recording": recording});
    }).catch(err => {
        console.log(err);
        res.status(400).send("Unable to save to DB");
    });
});

recordingRoutes.route('/:id').get(function(req, res) {
    VoiceRecording.findById(req.params.id, (err, recording) => {
        if(err) {
            console.log(err);
            res.status(400).json({"message" : err.message});
        } else {
            res.json(recording);
        }
    });
});

// Update the audio ids and indices for a given recording
recordingRoutes.route('/updateTracks/:id').post(function (req, res) {
    VoiceRecording.findById(req.params.id, function(err, recording) {
        if(err) {
          console.log(err);
          return res.status(400).json(err);
        }
        if(recording) {
            logger.info(`Request Paragraph audio ids: ${req.body.paragraphAudioIds}`);
            logger.info(`Request Paragraph indices: ${req.body.paragraphIndices}`);
            logger.info(`Stored Paragraph audio ids: ${recording.paragraphAudioIds}`);
            logger.info(`Stored Paragraph indices: ${recording.paragraphIndices}`);
          
            if(req.body.paragraphAudioIds)
                recording.paragraphAudioIds = req.body.paragraphAudioIds;
            if(req.body.paragraphIndices)
                recording.paragraphIndices = req.body.paragraphIndices;
            if(req.body.sentenceAudioIds)
                recording.sentenceAudioIds = req.body.sentenceAudioIds;
            if(req.body.sentenceIndices)
                recording.sentenceIndices = req.body.sentenceIndices;
            
            recording.save().then(
              ok  =>  res.json('Update complete'),
              err =>  res.status(400).send("Unable to update"));
        }
    });
})

const storage = multer.memoryStorage();
const upload = multer({storage,
  limits: {
    fields: 1,
    fileSize: 6000000,
    files: 1,
    parts: 2 }});
recordingRoutes.route('/saveAudio/:storyId/:index/:uuid').post(
  upload.single('audio'),
  async (req, res) => {
    const filename = "voice-rec-" + req.params.storyId.toString() + "-" + req.params.uuid.toString();
    const metadata = {story:req.params.storyId,uuid:req.params.uuid};
    const [uploadErr,fileId] =
      await voiceRecording
        .upload(req.file.buffer,filename,metadata)
        .then(id=>[null,id],e=>[e]);
    if(uploadErr){
      console.error(error);
      return res.status(500).json(error);
    }
    const index = req.params.index;
    return res.status(201).json({fileId,index});
});

recordingRoutes.route('/audio/:id').get((req, res) => {
    let audioId;
    // get the audio id from the audio id set to the story
    try {
        audioId = new ObjectID(req.params.id);
    } catch(err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }

    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');
    // get collection name for audio files
    let bucket = voiceRecording.bucket();
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
})

recordingRoutes.route('/getHistory/:storyId').get((req, res) => {
  VoiceRecording.find({"storyData._id":req.params.storyId, "archived":true}, (err, recordings) => {
      if(err) {
          console.log(err);
          res.status(400).json({"message" : err.message});
      } else {
          res.json(recordings);
      }
  });
  
});

recordingRoutes.route('/updateArchiveStatus/:recordingId').get((req, res) => {
  VoiceRecording.findById(req.params.recordingId, (err, recording) => {
      if(err) {
          console.log(err);
          res.status(400).json({"message" : err.message});
      } else {
          recording.archived = true;
          recording.save();
      }
  });
  
});

// Delete audio recordings for story
recordingRoutes.route('/deleteStoryRecordingAudio/:id').get((req, res) => {
    VoiceRecording.find({"storyData._id" : req.params.id}, (err, recordings) => {
        if(err) 
          res.status(400).json(err);
        if(!recordings) {
          res.status(404).json({"message" : "Voice Recording does not exist"});
        }
          
        let bucket = voiceRecording.bucket();
      
        recordings.forEach(recording => {    
          recording.paragraphAudioIds.forEach(paragraphAudioId => {
              bucket.delete(new ObjectID(paragraphAudioId), (err) => {
                if(err) {
                  //console.log("File does not exist");
                  res.status(404).json("Paragraph audio file does not exist");
                }
              });
          });
    
          recording.sentenceAudioIds.forEach(sentenceAudioId => {
              bucket.delete(new ObjectID(sentenceAudioId), (err) => {
                if(err) {
                    //console.log("File does not exist");
                    res.status(404).json("Sentence audio file does not exist");
                }
              });
          });
        });
        
        res.status(200).json("Successfully deleted all audio recordiings for story"); 
    });
});

// Delete all messages with recipient id
recordingRoutes.route('/deleteStoryRecording/:id').get(function(req, res) {
    VoiceRecording.deleteMany({"storyData._id": req.params.id}, function(err, recordings) {
        if(err) res.json(err);
        else res.json("Successfully removed all voice recording objects for story");
    });
});




module.exports = recordingRoutes;
