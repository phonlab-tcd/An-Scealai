// @ts-nocheck
const express = require("express");
const engagementRoutes = express.Router();
const logger = require("../logger");
import random from "../test-utils/random";
import multer from "multer";
const storage = multer.memoryStorage();
const limits = { fields: 1, fileSize: 6000000, files: 1, parts: 2 };
const upload = multer({ storage, limits });
const recordingUtil = require("../utils/recordingUtils");

const Event = require("../models/event");
const User = require("../models/user");
const PlaySynthesis = require("../models/engagement.playSynthesis");
const SaveStoryEvent = require("../models/engagement.saveStory");
const MouseOverGrammarErrorEvent = require("../models/engagement.mouseOverGrammar");

/**
 * Create a new PlaySynthesis event
 * @param {Object} req body: PlaySynthesis object (see models/engagement.playSynthesis)
 * @return {Object} Success or error message
 */
engagementRoutes.route("/addEvent/playSynthesis").post(async (req, res, next) => {
    const itWas = await PlaySynthesis.create(req.body).then(
      (ok) => ({ ok }),
      (anError) => ({ anError })
    );
    if (itWas.anError) return next(itWas.anError);
    return res.json(itWas.ok);
  });

/**
 * Create a new Save Story event
 * @param {Object} req body: Save story event object
 * @return {Object} Success or error message
 */
engagementRoutes.route("/addEvent/saveStory").post(async (req, res, next) => {
  const itWas = await SaveStoryEvent.create(req.body).then(
    (ok) => ({ ok }),
    (anError) => ({ anError })
  );
  if (itWas.anError) return next(itWas.anError);
  return res.json(itWas.ok);
});

/**
 * Create a new Mouse over grammar error event
 * @param {Object} req body: grammar error tags
 * @return {Object} Success or error message
 */
engagementRoutes.route("/addEvent/mouseOverGrammarError").post(async (req, res, next) => {
    const itWas = await MouseOverGrammarErrorEvent.create(req.body.event).then(
      (ok) => ({ ok }),
      (anError) => ({ anError })
    );
    console.log(itWas);
    if (itWas.anError) return next(itWas.anError);
    return res.json(itWas.ok);
  });

/**
 * Create a new Speak Story event
 * @param {Object} req body: audio blob and ASR transcription
 * @return {Object} Success or error message
 */
engagementRoutes.route("/addEvent/speakStory").post(upload.single("audio"), postSaveAudio);

async function postSaveAudio(req, res) {
  const filename = "asr-rec-" + "-" + random.string();

  if (!req.file || !req.file.buffer) return res.status(400).json("no file");

  const [uploadErr, fileId] = await recordingUtil.upload(
      req.file.buffer,
      filename,
      { transcription: req.body.transcription },
      "engagement.speakStory"
    )
    .then( (id) => [null, id], (e) => [e] );

  if (uploadErr) {
    console.error(uploadErr);
    logger.error(uploadErr);
    return res.status(500).json(uploadErr);
  }

  return res.status(201).json(fileId);
}

/**
 * Add an event object to the DB for a given user
 * @param {Object} req params: User ID
 * @param {Object} req body: Event object
 * @return {Object} Success or error message
 */
engagementRoutes.route("/addEventForLoggedInUser/:id").post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      const stackTrace = {};
      Error.captureStackTrace(stackTrace);
      logger.error({
        endpoint: "/engagement/addEventForUser/:id",
        "error.message": err.message,
        stackTrace: stackTrace,
      });
      return res.json(err);
    }
    if (user) {
      if (req.body.event) {
        const event = new Event();
        event.data = req.body.event.data;
        event.type = req.body.event.type;
        event.ownerId = user._id;
        event.save().then(() => {
          return res.status(200).json("Event added succesfully");
        });
      } else {
        return res.status(400).json("Bad request, must include event object in request body");
      }
    } else {
      res.status(404).json("User does not exist");
    }
  });
});

/**
 * Get all events for a given user
 * @param {Object} req params: User ID
 * @return {Object} List of events
 */
engagementRoutes.route("/eventsForUser/:id").get((req, res) => {
  Event.find({ userId: req.params.id }, (err, events) => {
    if (err) {
      res.json(err);
    }
    if (events) {
      res.status(200).json(events);
    } else {
      res.status(404).json("User does not have any events.");
    }
  });
});

/**
 * Add an admin stats analysis event object to the DB (profile/feature stats)
 * @param {Object} req body: Event object
 * @return {Object} Success or error message
 */
engagementRoutes.route("/addAnalysisEvent").post((req, res) => {
  const event = new Event();
  event.type = req.body.event.type;
  event.statsData = req.body.event.statsData;
  event.userId = req.body.event.userId;
  event.date = new Date();

  event.save().then((event) => {
      return res.status(200).json({ event: "event added successfully", id: event._id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send("unable to save event to DB");
    });
});

/**
 * Add all events of a given type
 * @param {Object} req params: Event type
 * @return {Object} Success or error message
 */
engagementRoutes.route("/getPreviousAnalysisData/:type").get((req, res) => {
  Event.find({ type: req.params.type }, (err, events) => {
    if (err) {
      return res.json(err);
    }
    if (events) {
      return res.status(200).json(events);
    } else {
      return res.status(404).json("DB does not have any event stats data.");
    }
  });
});

/**
 * Get all events associated with a given story
 * @param {Object} req params: Story ID
 * @return {Object} List of events
 */
engagementRoutes.route("/eventsForStory/:id").get((req, res) => {
  Event.find({ "data.storyObject._id": req.params.id }, (err, events) => {
    if (err) {
      return res.json(err);
    }
    if (events) {
      return res.status(200).json(events);
    } else {
      return res.status(404).json("User does not have any events.");
    }
  });
});

/**
 * Get all dictionary lookup events within an optional date range
 * @param {Object} req params: User ID
 * @param {Object} req body: start date for date range
 * @param {Object} req body: end date for date range
 * @return {Object} List of events
 */
engagementRoutes.route("/dictionaryLookups/:id").post((req, res) => {
  const conditions = { userId: req.params.id, type: "USE-DICTIONARY" };
  if (req.body.startDate !== "" && req.body.endDate !== "") {
    conditions["date"] = {
      $gte: req.body.startDate,
      $lte: req.body.endDate,
    };
  }
  Event.find(conditions, (err, events) => {
    if (err) {
      return res.json(err);
    }
    if (events) {
      const filtered = events.filter(function (el) {
        return el.dictionaryLookup && el.dictionaryLookup != null;
      });
      // sort descending chronologically
      filtered.sort(function (a, b) {
        const keyA = new Date(a.date);
        const keyB = new Date(b.date);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      return res.status(200).json(filtered);
    } else {
      return res.status(404).json("User does not have any dictionary lookups.");
    }
  });
});

module.exports = engagementRoutes;
