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

descriptionGameRoutes
  .post('/audio',
    multer.any(),
    ep(['audio'],'post'));

descriptionGameRoutes
  .get('/audio/:id',
    ep(['audio'],'get'));

descriptionGameRoutes
  .get('/allAudio',
    ep(['allAudio'],'get'));

descriptionGameRoutes
  .get('/next/describe',
    ep(['next','describe'],'get'));

descriptionGameRoutes
  .get('/next/interpret',
    ep(['next','interpret'],'get'));

module.exports = descriptionGameRoutes;
