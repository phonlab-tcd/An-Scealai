const app = require('../server');
const descriptionGameRoutes = require('express').Router();
const jwtAuthMw = require('../utils/jwtAuthMw');
const multer = require('multer')();
const Promise = require('bluebird');
const path = require('path');
const fs = require('fs').promises;
const AudioMessage = require('../models/audioMessage');


descriptionGameRoutes
  .route('/audio')
  .post(
    jwtAuthMw,
    multer.any(),
    async (req,res,next) => {
      app.logger.info({
        route: '/description-game/audio',
        user: req.user,
        body: req.body,
        numFiles: req.files.length,
      });
      const dir = path.join(
        __dirname,
        '..',
        'audioMessages',
        req.user._id);
      const [_, audioMessages] = await Promise.all([
        fs.mkdir(dir).catch(e=>{
          if(e.code === 'EEXIST')return
          else throw e
        }),
        AudioMessage.create(req.files.map(file => {
          return {
            public: true,
            ownerId: req.user._id,
            dir: dir.toString(),
            mimetype: file.mimetype,
          }
        })),
      ]);
      await audioMessages.map(async (am,i)=>{
        console.log(am);
        await fs.writeFile(am.path(), req.files[i].buffer)
      });;
      res.sendStatus(200);
    });

module.exports = descriptionGameRoutes;

