const app = require('../server');
const descriptionGameRoutes = require('express').Router();
const jwtAuthMw = require('../utils/jwtAuthMw');
const multer = require('multer')();
const path = require('path');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs').promises;

function ep(_path,method) {
  _path = path.join('..','endpoints_functions','description-game',..._path);
  const module = require(_path);
  const func = method ? module[method] : module;
  return (req,res,next) => {
    try {
      console.log(module);
      console.log(_path, func);
      func(req,res,next);
    } catch(e) {
      next(e);
    }
  }
}

if(process.env.NO_AUTH != 1)
  descriptionGameRoutes.use(jwtAuthMw);
else {
  console.log('NO AUTH for /description-game');
  const User = require('../models/user');
  descriptionGameRoutes.use(async (req,res,next)=>{
    const re = /n[a-z]+/i;
    req.user = await User.findOne({username: {$regex: re}});
    next();
  });
}
const POST = 'post';
const GET = 'get';

descriptionGameRoutes
  .post('/audio',
    multer.any(),
    ep(['audio'], POST));

descriptionGameRoutes
  .get('/audio/:id',
    ep(['audio'], GET));

descriptionGameRoutes
  .get('/meta/audio/:id',
    ep(['meta','audio'], GET));

descriptionGameRoutes
  .get('/allAudio',
    ep(['allAudio'], GET));

descriptionGameRoutes
  .get('/next/describe',
    ep(['next','describe'], GET));

descriptionGameRoutes
  .get('/next/interpret',
    ep(['next','interpret'], GET));

descriptionGameRoutes
  .post('/submit/describe',
    ep(['submit','describe'], POST));

console.log(descriptionGameRoutes.stack);

module.exports = descriptionGameRoutes;
