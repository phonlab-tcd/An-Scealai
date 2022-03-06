const app = require('../server');
const descriptionGameRoutes = require('express').Router();
const jwtAuthMw = require('../utils/jwtAuthMw');
const multer = require('multer')();
const fs = require('fs');

descriptionGameRoutes
  .route('/audio')
  .post(
    jwtAuthMw,
    multer.any(),
    (req,res,next) => {
      const buffer = req.files[0].buffer;
      req.files[0].buffer = undefined;
      app.logger.info(
        {user: req.user,
          body: req.body,
          file0: req.files[0]});
      res.sendStatus(200);
    });

module.exports = descriptionGameRoutes;

