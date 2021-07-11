"use strict";
var express = require('express');
var app = express();
var statsRoutes = express.Router();
var querystring = require('querystring');
var request = require('request');
var Event = require('../models/event');
var Story = require('../models/story');
statsRoutes.route('/synthesisFixes').get(function (req, res) {
    getTexts().then(function (data) {
        if (data) {
            var errorDifferences_1 = new Map();
            countErrors(data, 'BEFORE').then(function (beforeErrors) {
                console.log("BEFORE ERRORS", beforeErrors);
                countErrors(data, 'AFTER').then(function (afterErrors) {
                    console.log("AFTER ERRORS", afterErrors);
                    beforeErrors.forEach(function (val, key) {
                        if (afterErrors.has(key)) {
                            errorDifferences_1.set(key, (val - afterErrors.get(key)));
                        }
                        else {
                            errorDifferences_1.set(key, val);
                        }
                    });
                    res.json(mapToObj(errorDifferences_1));
                });
            });
        }
    });
});
function countErrors(data, dataSet) {
    return new Promise(function (resolve, reject) {
        var counter = 0;
        var errorsMap = new Map();
        data.forEach(function (d, index, array) {
            getGramadoirErrorsForText((dataSet === 'BEFORE') ? d.before : d.after).then(function (body) {
                errors = JSON.parse(body);
                errors.forEach(function (error) {
                    var ruleStr = error.ruleId.toString();
                    var ruleLabel = ruleStr.match("(?<=\/)(.*?)(?=\{|$)")[0];
                    if (errorsMap.has(ruleLabel)) {
                        errorsMap.set(ruleLabel, errorsMap.get(ruleLabel) + 1);
                    }
                    else {
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
    return new Promise(function (resolve, reject) {
        var data = [];
        Story.find({}, function (err, stories) {
            if (stories) {
                var counter_1 = 0;
                stories.forEach(function (story, index, array) {
                    getEvents(story).then(function (eventData) {
                        //data.push(eventData); // This pushes data per story (as opposed to all together)
                        eventData.forEach(function (datum) {
                            data.push(datum);
                        });
                        counter_1++;
                        console.log(counter_1, array.length);
                        if (counter_1 === array.length) {
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
    return new Promise(function (resolve, reject) {
        var data = [];
        Event.find({ "storyData._id": story._id.toString() }, function (err, events) {
            if (events) {
                if (events.length > 0) {
                    var previousEvent_1 = events[0];
                    events.forEach(function (event, index, array) {
                        if (previousEvent_1.type === "SYNTHESISE-STORY"
                            && event.type === "SAVE-STORY") {
                            data.push({ "before": previousEvent_1.storyData.text,
                                "after": event.storyData.text });
                        }
                        if (index === array.length - 1) {
                            resolve(data);
                        }
                        previousEvent_1 = event;
                    });
                }
                else {
                    resolve([]);
                }
            }
        });
    });
}
function getGramadoirErrorsForText(text) {
    var form = {
        teacs: text.replace(/\n/g, " "),
        teanga: 'en',
    };
    var formData = querystring.stringify(form);
    return new Promise(function (resolve, reject) {
        request({ headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            uri: 'https://cadhan.com/api/gramadoir/1.0',
            body: formData,
            method: 'POST'
        }, function (err, resp, body) {
            if (body) {
                resolve(body);
            }
        });
    });
}
function mapToObj(inputMap) {
    var obj = {};
    inputMap.forEach(function (value, key) {
        obj[key] = value;
    });
    return obj;
}
module.exports = statsRoutes;
