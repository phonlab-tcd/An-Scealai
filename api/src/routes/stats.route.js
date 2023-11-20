const express = require("express");
const statsRoutes = express.Router();

const Event = require("../models/event");
const PlaySynthesisEvent = require("../models/engagement.playSynthesis");
const SaveStoryEvent = require("../models/engagement.saveStory");
const MouseOverGrammarError = require("../models/engagement.mouseOverGrammar");
const Profile = require("../models/profile");
const User = require("../models/user");
const recordingUtil = require("../utils/recordingUtils");

/**
 * Get profile data of active users within optional date range
 * @param {Object} req params: start date for date range
 * @param {Object} req params: end date for date range
 * @return {Object} List of profiles
 */
statsRoutes.route("/getProfileDataByDate/:startDate/:endDate").get(async (req, res, next) => {
  try {
    const conditions = { status: "Active" };
    if (req.params.startDate !== "empty" && req.params.endDate !== "empty") {
      conditions["verification.date"] = { $gte: req.params.startDate, $lte: req.params.endDate, };
    } else if (
      req.params.startDate !== "empty" &&
      req.params.endDate === "empty"
    ) {
      conditions["verification.date"] = { $gt: req.params.startDate, };
    }
    const ids = (await User.find(conditions, { _id: 1 })).map((u) => u._id);
    const promises = ids.map((id) => Profile.find({ userId: id }).limit(1));
    const profiles = await Promise.all(promises);
    return res.json(profiles);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

/**
 * Get website feature use data within optional date range
 * @param {Object} req params: start date for date range
 * @param {Object} req params: end date for date range
 * @return {Object} Dictionary of feature type and number of counts
 */
statsRoutes.route("/getFeatureDataByDate/:startDate/:endDate").get(async (req, res) => {
  let conditions = {};
  if (req.params.startDate !== "empty" && req.params.endDate !== "empty") {
    conditions = { createdAt: { $gte: req.params.startDate, $lte: req.params.endDate }, };
  }

  calculateEventTotals(conditions).then((typeCounts) => {
    if (typeCounts) {
      return res.status(200).json(typeCounts);
    } else {
      return res.json({ message: "Counting event types failed" });
    }
  });
});

/**
 * Count the total number of logs for each event type logged to the DB
 * @param {*} searchConditions optional start/end dates for filtering event log search
 * @returns dictionary of event types and their total counts
 */
function calculateEventTotals(searchConditions) {
  return new Promise(async (resolve, reject) => {
    try {
      const genericEvents = await Event.find(searchConditions);
      const types = genericEvents.map((entry) => entry.type);
      const typesCount = countTypes(types);

      const playSynthesisEventCount = await PlaySynthesisEvent.find( searchConditions ).countDocuments();
      if (playSynthesisEventCount > 0) typesCount["PLAY-SYNTHESIS"] = playSynthesisEventCount;

      const saveStoryEventCount = await SaveStoryEvent.find( searchConditions ).countDocuments();
      if (saveStoryEventCount > 0) typesCount["SAVE-STORY"] = saveStoryEventCount;

      const mouseOverGrammarErrorEventCount = await MouseOverGrammarError.find( searchConditions ).countDocuments();
      if (mouseOverGrammarErrorEventCount > 0) typesCount["MOUSE-OVER-GRAMMAR-ERROR"] = mouseOverGrammarErrorEventCount;

      const speakStoryEventCount = await recordingUtil.countDocuments( searchConditions, "engagement.speakStory" );
      if (speakStoryEventCount > 0) typesCount["SPEAK-STORY"] = speakStoryEventCount;

      resolve(typesCount);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get website feature use data starting from the date of the last saved log
 * @param {Object} req params: start date for events
 * @return {Object} Dictionary of feature type and number of counts
 */
statsRoutes.route("/getFeatureDataSinceLog/:date").get(async (req, res) => {
  console.log(req.params.date);
  calculateEventTotals({ createdAt: { $gt: req.params.date } }).then((typeCounts) => {
    if (typeCounts) {
      console.log(typeCounts);
      return res.status(200).json(typeCounts);
    } else {
      return res.json({ message: "Counting event types failed" });
    }
  });
});

/**
 * Create a dictionary of event feature names and associated counts
 * @param {Array} array List of strings for event types
 * @return {Object} Dictionary of feature type and number of counts
 */
function countTypes(array) {
  const count = {};
  array.forEach((val) => (count[val] = (count[val] || 0) + 1));
  return count;
}

module.exports = statsRoutes;
