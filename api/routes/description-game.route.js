const app = require('../server');
const descriptionGameRoutes = require('express').Router();
const jwtAuthMw = require('../utils/jwtAuthMw');
const multer = require('multer')();
const path = require('path');

function ep(_path) {
  _path = path.join('..','endpoints_functions','description-game',_path);
  return (req,res,next) => {
    try {
      require(_path)(req,res,next)
    } catch(e) {
      next(e);
    }
  }
}

descriptionGameRoutes
  .route('/audio')
  .post(
    jwtAuthMw,
    multer.any(),
    ep('audio'));

module.exports = descriptionGameRoutes;

