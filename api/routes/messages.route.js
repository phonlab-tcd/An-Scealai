const express = require("express");
const messageRoutes = express.Router();
const multer = require("multer");
const { Readable } = require("stream");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectId;

const Message = require("../models/message");

// lazily get a connection to the database when needed;
const db = () => mongoose.connection.db;
const newBucket = () =>
  new mongodb.GridFSBucket(db(), { bucketName: "audioMessage" });

/**
 * Create a new message
 * @param {Object} req body: Message object
 * @return {Object} Success or error message
 */
messageRoutes.route("/create").post(function (req, res) {
  const message = new Message(req.body);
  message.save()
  .then((message) => {
    res.json(message);
  })
  .catch((err) => {
    res.status(400).send("unable to save to DB");
  });
});

/**
 * Get messages for a given user
 * @param {Object} req params: User ID
 * @return {Object} List of messages
 */
messageRoutes.route("/viewMessges/:id").get(function (req, res) {
  Message.find({ recipientId: req.params.id }, (err, message) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.json(message);
    }
  });
});

/**
 * Get a message by its ID
 * @param {Object} req params: Message ID
 * @return {Object} Message object from DB
 */
messageRoutes.route("/getMessageById/:id").get((req, res) => {
  Message.findOne({ id: req.params.id }, (err, message) => {
    if (err) res.json(err);
    if (message) res.json(message);
  });
});

/**
 * Set a message status to 'read'
 * @param {Object} req params: Message ID
 * @return {Object} Success or error message
 */
messageRoutes.route("/markAsOpened/:id").post((req, res) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) res.json(err);
    if (message) {
      message.seenByRecipient = true;
      message.save();
      res.status(200).json({ message: "Message viewed successfully" });
    } else {
      res.status(404).json({ message: "Message does not exist" });
    }
  });
});

/**
 * Update a sender's username for a given user
 * @param {Object} req params: ID of User sending the message
 * @param {Object} req body: Username of User sending the message
 * @return {Object} Success or error message
 */
messageRoutes.route("/updateSenderUsername/:id").post(function (req, res) {
  Message.find({ senderId: req.params.id }, function (err, messages) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      for (const message of messages) {
        message.senderUsername = req.body.username;
        message.save().catch((err) => {
          res.status(400).send("Unable to update");
        });
      }
      res.json("Successfully updated message sender username");
    }
  });
});

/**
 * Delete a message by ID
 * @param {Object} req params: Message ID
 * @return {Object} Success or error message
 */
messageRoutes.route("/delete/:id").get(function (req, res) {
  Message.findOneAndRemove({ _id: req.params.id }, function (err, message) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

/**
 * Delete all messages of a given recipient
 * @param {Object} req params: ID of User recipient
 * @return {Object} Success or error message
 */
messageRoutes.route("/deleteAllMessages/:userId").get(function (req, res) {
  Message.deleteMany(
    { recipientId: req.params.userId },
    function (err, message) {
      if (err) res.json(err);
      else res.json("Successfully removed all messages for user");
    }
  );
});

/**
 * Add audio to a message
 * @param {Object} req params: Message ID
 * @param {Object} req file: Audio buffer
 * @return {Object} Success or error message
 */
messageRoutes.route("/addMessageAudio/:id").post((req, res) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) res.json(err);
    if (message) {
      const storage = multer.memoryStorage();
      const upload = multer({
        storage: storage,
        limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 },
      });
      upload.single("audio")(req, res, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Upload Request Validation Failed" });
        }
        // read audio file into a stream
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);

        // generate audio ID and upload audio to DB as bucket
        const bucket = newBucket();
        const uploadStream = bucket.openUploadStream(
          "audio-for-message-" + message._id.toString()
        );
        message.audioId = uploadStream.id;

        // add audio ID to message object so it can be retrieved
        message.save();
        readableTrackStream.pipe(uploadStream);

        uploadStream.on("error", () => {
          return res.status(500).json({ message: "Error uploading file" });
        });

        uploadStream.on("finish", () => {
          return res.status(201).json({
            message: "File uploaded successfully, stored under Mongo",
          });
        });
      });
    } else {
      res.status(404).json({ message: "Message does not exist" });
    }
  });
});

/**
 * Get audio of a given message
 * @param {Object} req params: Message ID
 * @return {Object} Audio stream
 */
messageRoutes.route("/messageAudio/:id").get((req, res) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) res.json(err);
    if (message) {
      if (message.audioId) {
        // get audio ID from message object to search for the audio file in the DB
        let audioId;
        try {
          audioId = new ObjectID(message.audioId);
        } catch (err) {
          return res
            .status(400)
            .json({
              message:
                "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
            });
        }

        res.set("content-type", "audio/mp3");
        res.set("accept-ranges", "bytes");

        // download audio from DB
        const bucket = newBucket();
        const downloadStream = bucket.openDownloadStream(audioId);

        downloadStream.on("data", (chunk) => {
          res.write(chunk);
        });

        downloadStream.on("error", () => {
          res.sendStatus(404);
        });

        downloadStream.on("end", () => {
          res.end();
        });
      } else {
        res
          .status(404)
          .json({
            message: "No audio feedback has been associated with this message",
          });
      }
    } else {
      res.status(404).json({ message: "Message does not exist" });
    }
  });
});

/**
 * Delete audio for a given message
 * @param {Object} req params: Message ID
 * @return {Object} Success or error message
 */
messageRoutes.route("/deleteMessageAudio/:id").get((req, res) => {
  Message.findById(req.params.id, (err, message) => {
    if (err) return res.json(err);
    if (message) {
      if (message.audioId) {
        let audioId;
        try {
          audioId = new ObjectID(message.audioId);
        } catch (err) {
          return res
            .status(400)
            .json({
              message:
                "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
            });
        }

        const bucket = newBucket();
        const downloadStream = bucket.delete(audioId);
        res.status(200).json({ message: "Audio deleted successfully" });
      }
    } else {
      res.status(404).json({ message: "Message does not exist" });
    }
  });
});

module.exports = messageRoutes;
