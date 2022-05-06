const express = require('express');
const app = express();
const statsRoutes = express.Router();
const querystring = require('querystring');
const request = require('request');

let Event = require('../models/event');
let Story = require('../models/story');
let Profile = require('../models/profile');
let User = require('../models/user');

statsRoutes.route('/getProfileDataByDate/:startDate/:endDate').get((req, res) => {
  let conditions = {}
  if(req.params.startDate !== "empty" && req.params.endDate !== "empty") {
    conditions = {"status":"Active", "verification.date": {'$gte': req.params.startDate, '$lte': req.params.endDate}};
  }
  else if (req.params.startDate !== "empty" && req.params.endDate === "empty") {
    conditions = {"status":"Active", "verification.date": {'$gt': req.params.startDate}};
  }
  else {
    conditions = {"status":"Active"};
  }
  
  User.find(conditions, (err, users) => {
    if(err) {
      res.status(400).send("An error occurred while trying to find users by date");
    }
    if(!users) {
      res.status(404).send({"message": "Users in this date range were not found"});  
    }
    else {
      let ids = [];
      users.forEach(user => {
        ids.push(user["_id"]);
      });
      
      function findProfile(id) {
        return new Promise ((resolve) => {
          Profile.find({"userId":id}, (err, profile) => {
              if(err) {
                res.status(400).send("An error occurred while trying to find a profile with this user id");
              }
              if(!profile) {
                res.status(404).send("Profile for this user id not found");  
              }
              else {
                resolve(profile);
              }
          });
        })
      };
      
      async function getProfiles(ids) {
        var profiles = [];
        for (const id of ids) {
          const profile = await findProfile(id);
          profiles.push(profile);
        }
        res.status(200).json(profiles);
      }

      getProfiles(ids);
    }  
  });
    
});

statsRoutes.route('/getFeatureDataByDate/:startDate/:endDate').get((req, res) => {
  let conditions = {}
  if(req.params.startDate !== "empty" && req.params.endDate !== "empty") {
    conditions = {"date": {'$gte': req.params.startDate, '$lte': req.params.endDate}};
  }
    
  Event.find(conditions, (err, events) => {
    if(err) {
      res.status(400).send("An error occurred while trying to find users by date");
    }
    if(!events) {
      res.status(404).send({"message": "No feature stats in this date range were not found"});  
    }
    else {
      res.status(200).json(events);
    }
  });
});

statsRoutes.route('/getFeatureDataSinceLog/:date').get((req, res) => {
  Event.find({"date": {'$gt': req.params.date}}, (err, events) => {
    if(err) {
      res.status(400).send("An error occurred while trying to find the latest feature record");
    }
    if(!events) {
      res.status(404).send({"message": "No previous feature stats were found"});  
    }
    else {
      res.status(200).json(events);
    }
  });
});


statsRoutes.route('/synthesisFixes').get((req, res) => {
    getTexts().then(data => {
        if(data) {
            let errorDifferences = new Map();
            countErrors(data, 'BEFORE').then(beforeErrors => {
                countErrors(data, 'AFTER').then(afterErrors => {
                    beforeErrors.forEach((val, key) => {
                        if(afterErrors.has(key)) {
                            errorDifferences.set(key, (val-afterErrors.get(key)));
                        } else {
                            errorDifferences.set(key, val);
                        }
                    });
                    res.json(mapToObj(errorDifferences));
                });
            })
        }
    });
});

function countErrors(data, dataSet) {
    return new Promise((resolve, reject) => {
        let counter = 0;
        let errorsMap = new Map();
        data.forEach((d, index, array ) => {
            getGramadoirErrorsForText((dataSet === 'BEFORE') ? d.before : d.after).then(body => {
                const errors = JSON.parse(body) || [];
                errors.forEach(error => {
                    let ruleStr =  error.ruleId.toString();
                    let ruleLabel = ruleStr.match("(?<=\/)(.*?)(?=\{|$)")[0];
                    if(errorsMap.has(ruleLabel)) {
                        errorsMap.set(ruleLabel, errorsMap.get(ruleLabel)+1);
                    } else {
                        errorsMap.set(ruleLabel, 1);
                    }
                });
                counter++;
                if(counter === array.length) {
                    resolve(errorsMap);
                }
            });
        });
    });
}

function getTexts() {
    return new Promise((resolve, reject) => {
        let data = [];
        Story.find({}, (err, stories) => {
            if(stories) {
                
                let counter = 0;

                stories.forEach((story, index, array) => {
                    getEvents(story).then(eventData => {
                        //data.push(eventData); // This pushes data per story (as opposed to all together)
                        eventData.forEach(datum => {
                            data.push(datum);
                        });
                        counter++;
                        if(counter === array.length) {
                            resolve(data);
                        }
                    });
                });
            }
        });
    });
}

function getEvents(story) {
    return new Promise((resolve, reject) => {
        let data = [];
        Event.find({"storyData._id":story._id.toString()}, (err, events) => {
            if(events) {
                if(events.length > 0) {
                    let previousEvent = events[0];
                    events.forEach((event, index, array) => {
                        if(previousEvent.type === "SYNTHESISE-STORY"
                        && event.type === "SAVE-STORY") {
                            data.push({"before" : previousEvent.storyData.text,
                                        "after" : event.storyData.text});
                        }
                        if(index === array.length-1) {
                            resolve(data);
                        }
                        previousEvent = event;
                    });
                } else {
                    resolve([]);
                }
            }
        })
    });
}

function getGramadoirErrorsForText(text) {
    let form = {
        teacs: text.replace(/\n/g, " "),
        teanga: 'en',
    };
    let formData = querystring.stringify(form);

    return new Promise(function(resolve, reject) {
        request({headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            uri: 'https://cadhan.com/api/gramadoir/1.0',
            body: formData,
            method: 'POST'
        }, (err, resp, body) => {
            if (body) {
                resolve(body);
            }
        });
      });
}

function mapToObj(inputMap) {
    const obj = {};
    inputMap.forEach((value, key)=>{obj[key] = value});
    return obj;
}

module.exports = statsRoutes;
