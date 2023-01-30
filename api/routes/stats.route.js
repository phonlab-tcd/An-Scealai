const express = require('express');
const statsRoutes = express.Router();

const Event = require('../models/event');
const Profile = require('../models/profile');
const User = require('../models/user');

statsRoutes.route('/getProfileDataByDate/:startDate/:endDate').get(async (req, res, next) => {
  try {
    const conditions = {status: 'Active'};
    if (req.params.startDate !== 'empty' && req.params.endDate !== 'empty') {
      conditions['verification.date'] = {
        $gte: req.params.startDate,
        $lte: req.params.endDate,
      };
    } else
    if (req.params.startDate !== 'empty' && req.params.endDate === 'empty') {
      conditions['verification.date'] = {
        $gt: req.params.startDate,
      };
    }
    const ids = (await User.find(conditions, {_id: 1})).map((u)=>u._id);
    const promises = ids.map((id)=>Profile.find({userId: id}).limit(1));
    const profiles = await Promise.all(promises);
    res.json(profiles);
  } catch (e) {
    console.error(e); next(e);
  }
});

statsRoutes.route('/getFeatureDataByDate/:startDate/:endDate').get(async (req, res) => {
  let conditions = {};
  if (req.params.startDate !== 'empty' && req.params.endDate !== 'empty') {
    conditions = {'date': {'$gte': req.params.startDate, '$lte': req.params.endDate}};
  }

  await Event.find(conditions, (err, events) => {
    if (err) {
      console.log(err);
      res.status(400).send('An error occurred while trying to find users by date');
    }
    if (!events) {
      res.status(404).send({'message': 'No feature stats in this date range were not found'});
    } else {
      const types = events.map((entry) => entry.type);
      const typesCount = countTypes(types);
      res.status(200).json(typesCount);
    }
  });
});

statsRoutes.route('/getFeatureDataSinceLog/:date').get((req, res) => {
  Event.find({'date': {'$gt': req.params.date}}, (err, events) => {
    if (err) {
      console.log(err);
      res.status(400).send('An error occurred while trying to find the latest feature record');
    }
    if (!events) {
      res.status(404).send({'message': 'No previous feature stats were found'});
    } else {
      const types = events.map((entry) => entry.type);
      const typesCount = countTypes(types);
      res.status(200).json(typesCount);
    }
  });
});

function countTypes(array) {
  const count = {};
  array.forEach((val) => count[val] = (count[val] || 0) + 1);
  return count;
}

module.exports = statsRoutes;
