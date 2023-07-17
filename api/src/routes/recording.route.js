const express = require("express");
const recordingRoutes = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const logger = require("../logger.js");

const VoiceRecording = require("../models/recording");
const recordingUtil = require("../utils/recordingUtils");

const storage = multer.memoryStorage();
const limits = { fields: 1, fileSize: 6000000, files: 1, parts: 2 };
const upload = multer({ storage, limits });

/**
 * Create a new voice recording
 * @param {Object} req body: Voice Recording object
 * @param {Object} req user: User object
 * @return {Object} Success or error message
 */
recordingRoutes.route("/create").post((req, res) => {
  const recording = new VoiceRecording(req.body);
  recording
    .save()
    .then((_) => {
      res.status(200).json(recording);
    })
    .catch((err) => {
      console.log(err);
      logger.error(err);
      res.status(400).send("Unable to save to DB");
    });
});

/**
 * Get a voice recording object
 * @param {Object} req params: Voice recording ID
 * @return {Object} Voice recording object
 */
recordingRoutes.route("/:id").get(function (req, res) {
  VoiceRecording.findById(req.params.id, (err, recording) => {
    if (err) {
      console.log(err);
      logger.error(err);
      return res.status(400).json({ message: err.message });
    } else {
      return res.json(recording);
    }
  });
});

/**
 * Update the audio/paragraph/sentence/transcriptions for a given recording ID
 * @param {Object} req params: Voice Recording ID
 * @param {Object} body paragraph and sentence ID, audio, and transcription data
 * @return {Object} Success or error message
 */
recordingRoutes.route("/updateTracks/:id").post(postUpdateTracks);

async function postUpdateTracks(req, res, next) {
  if (!req.body) return res.status(400).json("no recording body");

  // get voice recording object from the DB
  async function findRecording() {
    try {
      return [null, await VoiceRecording.findById(req.params.id)];
    } catch (e) {
      return [e];
    }
  }

  const [error, recording] = await findRecording();

  if (error) return res.status(400).json(error);
  if (!recording) return res.sendStatus(404);

  logger.info(`Request Paragraph audio ids: ${req.body.paragraphAudioIds}`);
  logger.info(`Request Paragraph indices:   ${req.body.paragraphIndices}`);
  logger.info(`Request Paragraph transcriptions:   ${req.body.paragraphTranscriptions}`);
  logger.info(`Stored Paragraph audio ids:  ${recording.paragraphAudioIds}`);
  logger.info(`Stored Paragraph indices:    ${recording.paragraphIndices}`);
  logger.info(`Stored Paragraph transcriptions:    ${recording.paragraphTranscriptions}`);

  // reset all values
  if (req.body.paragraphAudioIds)
    recording.paragraphAudioIds = req.body.paragraphAudioIds;
  if (req.body.paragraphIndices)
    recording.paragraphIndices = req.body.paragraphIndices;
  if (req.body.paragraphTranscriptions)
    recording.paragraphTranscriptions = req.body.paragraphTranscriptions;
  if (req.body.sentenceAudioIds)
    recording.sentenceAudioIds = req.body.sentenceAudioIds;
  if (req.body.sentenceIndices)
    recording.sentenceIndices = req.body.sentenceIndices;
  if (req.body.sentenceTranscriptions)
    recording.sentenceTranscriptions = req.body.sentenceTranscriptions;

  //await recording.save();
  const [saveErr, updatedRecording] = await recording.save().then(r => [null, r], e => [e]);;

  if(saveErr) {
    logger.error(saveErr);
    return res.status(400).json(saveErr);
  }
  return res.json(updatedRecording);
  //return res.json("Update complete");
}

/**
 * Save audio for a voice recording object
 * @param {Object} req params: Story ID
 * @param {Object} req params: uuid: Generated random ID
 * @param {Object} req params: index: Index of paragraph/sentence for audio
 * @param {Object} req file: Audio buffer
 * @return {Object} Success or error message, file Id and audio index
 */
recordingRoutes.route("/saveAudio/:storyId/:index/:uuid").post(upload.single("audio"), postSaveAudio);

async function postSaveAudio(req, res) {
  const filename = "voice-rec-" + req.params.storyId.toString() + "-" + req.params.uuid.toString();
  const metadata = { story: req.params.storyId, uuid: req.params.uuid };

  if (!req.file || !req.file.buffer) return res.status(400).json("no file");

  const [uploadErr, fileId] = await recordingUtil
    .upload(req.file.buffer, filename, metadata)
    .then( (id) => [null, id], (e) => [e] );

  if (uploadErr) {
    console.error(uploadErr);
    logger.error(uploadErr);
    return res.status(500).json(uploadErr);
  }
  const index = req.params.index;
  return res.status(201).json({ fileId, index });
}

/**
 * Get audio for a voice recording object
 * @param {Object} req params: Voice Recording ID
 * @return {Object} Audio stream
 */
recordingRoutes.route("/audio/:id").get((req, res) => {
  let audioId;
  // get the audio id from the audio id set to the story
  try {
    audioId = new mongoose.mongo.ObjectId(req.params.id);
  } catch (err) {
    console.log(err);
    logger.error(err);
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }

  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");
  // get collection name for audio files
  let bucket = recordingUtil.bucket();

  // create a new stream of file data using the bucket name
  let downloadStream = bucket.openDownloadStream(audioId);

  // write stream data to response if data is found
  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });
  // close the stream after data sent to response
  downloadStream.on("end", () => {
    res.end();
  });
});

/**
 * Get all archived recordings for a particular story
 * @param {Object} req params: Story ID
 * @return {Object} List of voice recordings
 */
recordingRoutes.route("/getRecordings/:storyId").get((req, res) => {
  VoiceRecording.find({ "storyData._id": req.params.storyId }, (err, recordings) => {
      if (err) {
        console.log(err);
        logger.error(err);
        return res.status(400).json({ message: err.message });
      } else {
        return res.json(recordings);
      }
    }
  );
});

/**
 * Get all archived recordings for a particular story
 * @param {Object} req params: Story ID
 * @return {Object} List of voice recordings
 */
recordingRoutes.route("/getHistory/:storyId").get((req, res) => {
  VoiceRecording.find({ "storyData._id": req.params.storyId, archived: true }, (err, recordings) => {
      if (err) {
        console.log(err);
        logger.error(err);
        res.status(400).json({ message: err.message });
      } else {
        res.json(recordings);
      }
    }
  );
});

/**
 * Set a voice recording status to 'archived'
 * @param {Object} req params: Voice Recording ID
 * @return {Object} Success or error message
 */
recordingRoutes.route("/updateArchiveStatus/:recordingId").get((req, res) => {
  VoiceRecording.findById(req.params.recordingId, async (err, recording) => {
    if (err) {
      console.log(err);
      logger.error(err);
      return res.status(400).json({ message: err.message });
    } else {
      recording.archived = true;
      await recording.save();
      console.log(recording);
      return res.status(200).json("Successfully updated recording archive status");
    }
  });
});

/**
 * Delete audio recordings for all paragraphs/sentences of a given story
 * @param {Object} req params: Story ID
 * @param {Object} body paragraph and sentence ID, audio, and transcription data
 * @return {Object} Success or error message
 */
recordingRoutes.route("/deleteStoryRecordingAudio/:id").get((req, res) => {
  VoiceRecording.find({ "storyData._id": req.params.id }, (err, recordings) => {
    if (err) res.status(400).json(err);

    if (!recordings) {
      res.status(404).json({ message: "Voice Recording does not exist" });
    }

    let bucket = recordingUtil.bucket();

    recordings.forEach((recording) => {
      recording.paragraphAudioIds.forEach((paragraphAudioId) => {
        bucket.delete(new mongoose.mongo.ObjectId(paragraphAudioId), (err) => {
          if (err) {
            // console.log("File does not exist");
            logger.error(err);
            res.status(404).json("Paragraph audio file does not exist");
          }
        });
      });

      recording.sentenceAudioIds.forEach((sentenceAudioId) => {
        bucket.delete(new mongoose.mongo.ObjectId(sentenceAudioId), (err) => {
          if (err) {
            // console.log("File does not exist");
            logger.error(err);
            res.status(404).json("Sentence audio file does not exist");
          }
        });
      });
    });

    res.status(200).json("Successfully deleted all audio recordiings for story");
  });
});

/**
 * Delete all voice recording objects for a given story
 * @param {Object} req params: Story ID
 * @return {Object} Success or error message
 */
recordingRoutes.route("/deleteStoryRecording/:id").get(function (req, res) {
  VoiceRecording.deleteMany({ "storyData._id": req.params.id }, function (err, recordings) {
      if (err) {
        logger.error(err);
        res.json(err);
      }
      else
        res.json("Successfully removed all voice recording objects for story");
    }
  );
});

module.exports = recordingRoutes;
