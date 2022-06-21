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
  
  const start = Date.now();
  User.find(conditions, async (err, users) => {
    console.log('first find', (Date.now()-start)/1000);
    if(err) {
      console.log(err);
      res.status(400).send("An error occurred while trying to find users by date");
    }
    if(!users) {
      res.status(404).send({"message": "Users in this date range were not found"});  
    }
    else {
      const ids = users.map(u=>u._id);;
      
      const profiles = await Promise.all(ids.map(id=>Profile.find({userId:id})));
      res.json(profiles);
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
      console.log(err);
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
  console.log("Function reached");
  Event.find({"date": {'$gt': req.params.date}}, (err, events) => {
    if(err) {
      console.log(err);
      res.status(400).send("An error occurred while trying to find the latest feature record");
    }
    if(!events) {
      res.status(404).send({"message": "No previous feature stats were found"});  
    }
    else {
      console.log(events);
      res.status(200).json(events);
    }  
  });
    
});


statsRoutes.route('/synthesisFixes').get((req, res) => {
    getTexts().then(data => {
        if(data) {
            let errorDifferences = new Map();
            countErrors(data, 'BEFORE').then(beforeErrors => {
                console.log("BEFORE ERRORS", beforeErrors);
                countErrors(data, 'AFTER').then(afterErrors => {
                    console.log("AFTER ERRORS", afterErrors);
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
                errors = JSON.parse(body)
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
                        console.log(counter, array.length);
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
    console.log("getEvents()");
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
    let obj = {};

    inputMap.forEach(function(value, key){
        obj[key] = value
    });

    return obj;
}

module.exports = statsRoutes;
