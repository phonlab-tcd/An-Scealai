const app = require('../server');
const descriptionGameRoutes = require('express').Router();
const jwtAuthMw = require('../utils/jwtAuthMw');
const multer = require('multer')();
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs').promises;

function ep(_path,method) {
  _path = path.join('..','endpoints_functions','description-game',_path);
  return (req,res,next) => {
    try {
      const module = require(_path);
      const func = method ? module[method] : module;
      func(req,res,next);
    } catch(e) {
      next(e);
    }
  }
}

descriptionGameRoutes
  .post('/audio',
    jwtAuthMw,
    multer.any(),
    ep('audio','post'));

descriptionGameRoutes
  .get('/audio/:id',
    jwtAuthMw,
    ep('audio','get'));

descriptionGameRoutes
  .get('/allAudio',
    jwtAuthMw,
    ep('allAudio','get'));

module.exports = descriptionGameRoutes;

