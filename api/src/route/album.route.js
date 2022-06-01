const express = require('express');
const app = express();
const logger = require('../util/logger');
const albumRoutes = express.Router();
const querystring = require('querystring');
const request = require('request');
const { parse, stringify } = require('node-html-parser');

let Models = require('../model/album');

let Recording = Models.Recording;
let Album = Models.Album;

albumRoutes.route('/create').post((req, res) => {
    let album = new Album(req.body);
    album.date = new Date();
    album.save().then(album => {
        res.status(200).json({"message" : "album created successfully", 
                                            "album" : album});
    }).catch(err => {
        res.status(400).send("Unable to save to DB");

        logger.log({
          level: 'error',
          endpoint: '/create',
          responsecode: 400,
          from: 'api',
          message: { error_message: err },
        });
    })
});

albumRoutes.route('/getById/:id').get((req, res) => {
  Album.findById(req.params.id, (err, album) => {
    if(err) res.json(err);
    if(album) {
      res.status(200).json(album);
    } else {
      res.status(404).json("Album not found");
      logger.log({
        level: 'error',
        endpoint: '/getById/:id',
        id: ( req.params.id ? req.params.id : 'id does not exist' ),
        responsecode: 400,
        from: 'api',
        message: { error_message: err },
      });
    }
  });
});

albumRoutes.route('/getForUser/:id').get((req, res) => {
    Album.find({userId : req.params.id}, (err, albums) => {
        if(err) res.json(err);
        if(albums) {
            res.status(200).json(albums);
        } else P
        res.status(404).json("No albums found for this user");
    })
})

albumRoutes.route('/delete/:id').get((req, res) => {
    Album.findByIdAndRemove(req.params.id, (err, album) => {
        if(err) res.json(err);
        if(album) {
            res.status(200).json("Album deleted successfully");
        } else {
            res.status(404).json("Album not found");
        }
    })
});

albumRoutes.route('/test').get((req, res) => {
    makeRecordings("Hey bb what isUP. hello");
})

async function makeRecordings(text) {
    let paragraphs = text.split('\n').filter((s) => {
        return s != '';
    });
    let recordings = [];
    for(let p of paragraphs) {
        let recording = new Recording();
        let cachedData = await synthesise(p);
        recording.cachedData = cachedData;
        recording.text = p;
        recordings.push(recording);
    }
    logger.debug(recordings);
}

function synthesise(text) {
    return new Promise(function (resolve, reject) {
        let form = {
            Input: text,
            Locale: 'ga_CM',
            Format: 'html',
            Speed: '1',
        };

        let formData = querystring.stringify(form);
        let contentLength = formData.length;

        request({
            headers: {
            'Host' : 'www.abair.tcd.ie',
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            uri: 'https://www.abair.tcd.ie/webreader/synthesis',
            body: formData,
            method: 'POST'
        }, function (err, resp, body) {
            if(err) reject(err);
            if(body) {
                let paragraph = parse(body.toString()).querySelectorAll('.audio_paragraph');
                let cachedData = {
                    sentences : [],
                    audio: '',
                };
                for(let child of paragraph[0].childNodes) {
                    if(child.tagName === 'span') {
                        cachedData.sentences.push(child.toString());
                    } else if(child.tagName === 'audio') {
                        cachedData.audio = child.id;
                    }
                }
                resolve(cachedData);
            }
        });
    });
}

module.exports = albumRoutes;
