const express = require('express');
const engagementRoutes = express.Router();
const logger = require('../logger');

const Event = require('../models/event');
const User = require('../models/user');
const PlaySynthesis = require('../models/engagement.playSynthesis');

/**
 * Create a new PlaySynthesis event
 * @param {Object} req body: PlaySynthesis object (see models/engagement.playSynthesis)
 * @return {Object} Success or error message
 */
engagementRoutes.route('/addEvent/playSynthesis').post(async (req, res, next)=>{
  const itWas = await PlaySynthesis.create(req.body).then((ok)=>({ok}), (anError)=>({anError}));
  if (itWas.anError) return next(itWas.anError);
  return res.json(itWas.ok);
});

/**
 * Add an event object to the DB for a given user
 * @param {Object} req params: User ID
 * @param {Object} req body: Event object
 * @return {Object} Success or error message
 */
engagementRoutes.route('/addEventForUser/:id').post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      const stackTrace = {};
      Error.captureStackTrace(stackTrace);
      logger.error({
        'endpoint': '/engagement/addEventForUser/:id',
        'error.message': err.message,
        'stackTrace': stackTrace,
      });
      return res.json(err);
    }
    if (user) {
      if (req.body.event) {
        const event = new Event();
        event.type = req.body.event.type;
        event.storyData = req.body.event.storyData; // may be null
        event.dictionaryLookup = req.body.event.dictionaryLookup; // may be null
        event.userId = user._id;
        event.date = new Date();
        event.save().then(() => {
          return res.status(200).json('Event added succesfully');
        });
      } else {
        return res.status(400)
            .json('Bad request, must include event object in request body');
      }
    } else {
      res.status(404).json('User does not exist');
    }
  });
});

/**
 * Get all events for a given user
 * @param {Object} req params: User ID
 * @return {Object} List of events
 */
engagementRoutes.route('/eventsForUser/:id').get((req, res) => {
  Event.find({'userId': req.params.id}, (err, events) => {
    if (err) {
      res.json(err);
    }
    if (events) {
      res.status(200).json(events);
    } else {
      res.status(404).json('User does not have any events.');
    }
  });
});

/**
 * Add an admin stats analysis event object to the DB (profile/feature stats)
 * @param {Object} req body: Event object
 * @return {Object} Success or error message
 */
engagementRoutes.route('/addAnalysisEvent').post((req, res) => {
  const event = new Event();
  event.type = req.body.event.type;
  event.statsData = req.body.event.statsData;
  event.userId = req.body.event.userId;
  event.date = new Date();

  event.save().then((event) => {
    res.status(200).json({'event': 'event added successfully', 'id': event._id});
  })
      .catch((err) => {
        console.log(err);
        res.status(400).send('unable to save event to DB');
      });
});

/**
 * Add all events of a given type
 * @param {Object} req params: Event type
 * @return {Object} Success or error message
 */
engagementRoutes.route('/getPreviousAnalysisData/:type').get((req, res) => {
  Event.find({'type': req.params.type}, (err, events) => {
    if (err) {
      res.json(err);
    }
    if (events) {
      res.status(200).json(events);
    } else {
      res.status(404).json('DB does not have any event stats data.');
    }
  });
});

/**
 * Get all events associated with a given story
 * @param {Object} req params: Story ID
 * @return {Object} List of events
 */
engagementRoutes.route('/eventsForStory/:id').get((req, res) => {
  Event.find({'storyData._id': req.params.id}, (err, events) => {
    if (err) {
      res.json(err);
    }
    if (events) {
      res.status(200).json(events);
    } else {
      res.status(404).json('User does not have any events.');
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
engagementRoutes.route('/dictionaryLookups/:id').post((req, res) => {
  const conditions = {'userId': req.params.id, 'type': 'USE-DICTIONARY'};
  if (req.body.startDate !== '' && req.body.endDate !== '') {
    conditions['date'] = {
      '$gte': req.body.startDate,
      '$lte': req.body.endDate,
    };
  };
  Event.find(conditions, (err, events) => {
    if (err) {
      res.json(err);
    }
    if (events) {
      const filtered = events.filter(function(el) {
        return (el.dictionaryLookup && el.dictionaryLookup != null);
      });
      res.status(200).json(filtered);
    } else {
      res.status(404).json('User does not have any dictionary lookups.');
    }
  });
});

module.exports = engagementRoutes;
