"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var app = express();
var logger = require('../logger');
var albumRoutes = express.Router();
var querystring = require('querystring');
var request = require('request');
var _a = require('node-html-parser'), parse = _a.parse, stringify = _a.stringify;
var Models = require('../models/album');
var Recording = Models.Recording;
var Album = Models.Album;
albumRoutes.route('/create').post(function (req, res) {
    var album = new Album(req.body);
    album.date = new Date();
    album.save().then(function (album) {
        res.status(200).json({ "message": "album created successfully",
            "album": album });
    }).catch(function (err) {
        res.status(400).send("Unable to save to DB");
        logger.log({
            level: 'error',
            endpoint: '/create',
            responsecode: 400,
            from: 'api',
            message: { error_message: err },
        });
    });
});
albumRoutes.route('/getById/:id').get(function (req, res) {
    Album.findById(req.params.id, function (err, album) {
        if (err)
            res.json(err);
        if (album) {
            res.status(200).json(album);
        }
        else {
            res.status(404).json("Album not found");
            logger.log({
                level: 'error',
                endpoint: '/getById/:id',
                id: (req.params.id ? req.params.id : 'id does not exist'),
                responsecode: 400,
                from: 'api',
                message: { error_message: err },
            });
        }
    });
});
albumRoutes.route('/getForUser/:id').get(function (req, res) {
    Album.find({ userId: req.params.id }, function (err, albums) {
        if (err)
            res.json(err);
        if (albums) {
            res.status(200).json(albums);
        }
        else
            P;
        res.status(404).json("No albums found for this user");
    });
});
albumRoutes.route('/delete/:id').get(function (req, res) {
    Album.findByIdAndRemove(req.params.id, function (err, album) {
        if (err)
            res.json(err);
        if (album) {
            res.status(200).json("Album deleted successfully");
        }
        else {
            res.status(404).json("Album not found");
        }
    });
});
albumRoutes.route('/test').get(function (req, res) {
    makeRecordings("Hey bb what isUP. hello");
});
function makeRecordings(text) {
    return __awaiter(this, void 0, void 0, function () {
        var paragraphs, recordings, _i, paragraphs_1, p, recording, cachedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paragraphs = text.split('\n').filter(function (s) {
                        return s != '';
                    });
                    recordings = [];
                    _i = 0, paragraphs_1 = paragraphs;
                    _a.label = 1;
                case 1:
                    if (!(_i < paragraphs_1.length)) return [3 /*break*/, 4];
                    p = paragraphs_1[_i];
                    recording = new Recording();
                    return [4 /*yield*/, synthesise(p)];
                case 2:
                    cachedData = _a.sent();
                    recording.cachedData = cachedData;
                    recording.text = p;
                    recordings.push(recording);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    logger.debug(recordings);
                    return [2 /*return*/];
            }
        });
    });
}
function synthesise(text) {
    return new Promise(function (resolve, reject) {
        var form = {
            Input: text,
            Locale: 'ga_CM',
            Format: 'html',
            Speed: '1',
        };
        var formData = querystring.stringify(form);
        var contentLength = formData.length;
        request({
            headers: {
                'Host': 'www.abair.tcd.ie',
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            uri: 'https://www.abair.tcd.ie/webreader/synthesis',
            body: formData,
            method: 'POST'
        }, function (err, resp, body) {
            if (err)
                reject(err);
            if (body) {
                var paragraph = parse(body.toString()).querySelectorAll('.audio_paragraph');
                var cachedData = {
                    sentences: [],
                    audio: '',
                };
                for (var _i = 0, _a = paragraph[0].childNodes; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child.tagName === 'span') {
                        cachedData.sentences.push(child.toString());
                    }
                    else if (child.tagName === 'audio') {
                        cachedData.audio = child.id;
                    }
                }
                resolve(cachedData);
            }
        });
    });
}
module.exports = albumRoutes;
