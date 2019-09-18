const express = require('express');
const app = express();
const statsRoutes = express.Router();
const querystring = require('querystring');
const request = require('request');

let Event = require('../models/event');
let Story = require('../models/story');

statsRoutes.route('/synthesisFixes').get((req, res) => {
    getTexts().then((texts) => {
        res.json(texts);
    });
});


function getTexts() {
    return new Promise(function(resolve, reject) {
        let texts = [];
        Story.find({}, (err, stories) => {
            if(stories) {
                stories.forEach((story) => {
                    Event.find({"storyData._id":story._id.toString()}, (err, events) => {
                        if(events) {
                            let prevEvent;
                            events.forEach((event) => {
                                if( prevEvent 
                                    && prevEvent.type === 'SYNTHESISE-STORY' 
                                    && event.type === 'SAVE-STORY') {
                                        console.log(prevEvent.storyData.text);
                                        texts.push(prevEvent.storyData.text);
                                }
                                prevEvent = event;
                            });
                        }
                    })
                });
                resolve(texts);
            }
        });
        
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

module.exports = statsRoutes;