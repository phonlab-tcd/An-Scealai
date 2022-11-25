const express = require('express');
const app = express();
const statsRoutes = express.Router();
const querystring = require('querystring');
const request = require('request');

const Event = require('../models/event');
const Story = require('../models/story');
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
      console.log(typesCount);
      res.status(200).json(typesCount);
    }
  });
});


statsRoutes.route('/synthesisFixes').get((req, res) => {
  getTexts().then((data) => {
    if (data) {
      const errorDifferences = new Map();
      countErrors(data, 'BEFORE').then((beforeErrors) => {
        console.log('BEFORE ERRORS', beforeErrors);
        countErrors(data, 'AFTER').then((afterErrors) => {
          console.log('AFTER ERRORS', afterErrors);
          beforeErrors.forEach((val, key) => {
            if (afterErrors.has(key)) {
              errorDifferences.set(key, (val-afterErrors.get(key)));
            } else {
              errorDifferences.set(key, val);
            }
          });
          res.json(mapToObj(errorDifferences));
        });
      });
    }
  });
});

function countTypes(array) {
  const count = {};
  array.forEach((val) => count[val] = (count[val] || 0) + 1);
  return count;
}

function countErrors(data, dataSet) {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const errorsMap = new Map();
    data.forEach((d, index, array ) => {
      getGramadoirErrorsForText((dataSet === 'BEFORE') ? d.before : d.after).then((body) => {
        errors = JSON.parse(body);
        errors.forEach((error) => {
          const ruleStr = error.ruleId.toString();
          const ruleLabel = ruleStr.match('(?<=\/)(.*?)(?=\{|$)')[0];
          if (errorsMap.has(ruleLabel)) {
            errorsMap.set(ruleLabel, errorsMap.get(ruleLabel)+1);
          } else {
            errorsMap.set(ruleLabel, 1);
          }
        });
        counter++;
        if (counter === array.length) {
          resolve(errorsMap);
        }
      });
    });
  });
}

function getTexts() {
  return new Promise((resolve, reject) => {
    const data = [];
    Story.find({}, (err, stories) => {
      if (stories) {
        let counter = 0;

        stories.forEach((story, index, array) => {
          getEvents(story).then((eventData) => {
            // data.push(eventData); // This pushes data per story (as opposed to all together)
            eventData.forEach((datum) => {
              data.push(datum);
            });
            counter++;
            console.log(counter, array.length);
            if (counter === array.length) {
              resolve(data);
            }
          });
        });
      }
    });
  });
}

function getEvents(story) {
  console.log('getEvents()');
  return new Promise((resolve, reject) => {
    const data = [];
    Event.find({'storyData._id': story._id.toString()}, (err, events) => {
      if (events) {
        if (events.length > 0) {
          let previousEvent = events[0];
          events.forEach((event, index, array) => {
            if (previousEvent.type === 'SYNTHESISE-STORY' &&
                        event.type === 'SAVE-STORY') {
              data.push({'before': previousEvent.storyData.text,
                'after': event.storyData.text});
            }
            if (index === array.length-1) {
              resolve(data);
            }
            previousEvent = event;
          });
        } else {
          resolve([]);
        }
      }
    });
  });
}

function getGramadoirErrorsForText(text) {
  const form = {
    teacs: text.replace(/\n/g, ' '),
    teanga: 'en',
  };

  const formData = querystring.stringify(form);

  return new Promise(function(resolve, reject) {
    request({headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    uri: 'https://cadhan.com/api/gramadoir/1.0',
    body: formData,
    method: 'POST',
    }, (err, resp, body) => {
      if (body) {
        resolve(body);
      }
    });
  });
}

function mapToObj(inputMap) {
  const obj = {};

  inputMap.forEach(function(value, key) {
    obj[key] = value;
  });

  return obj;
}

module.exports = statsRoutes;
