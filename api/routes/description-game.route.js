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
  console.log(module);
  console.log(_path, func);
  return (req,res,next) => {
    try {
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
const DELETE = 'delete';

///////////////////////////// POST
descriptionGameRoutes[POST](
  '/audio',
  multer.any(),
  ep(['audio'], POST));

descriptionGameRoutes[POST](
  '/submit/describe',
  ep(['submit','describe'],
  POST));

///////////////////////////// GET
descriptionGameRoutes[GET](
  '/audio/:id',
  ep(['audio'],
  GET));

descriptionGameRoutes[GET](
  '/meta/audio/:id',
  ep(['meta','audio'],
  GET));

descriptionGameRoutes[GET](
  '/allAudio',
  ep(['allAudio'],
  GET));

descriptionGameRoutes[GET](
  '/next/describe',
  ep(['next','describe'],
  GET));

descriptionGameRoutes[GET](
  '/next/interpret',
  ep(['next','interpret'],
  GET));

///////////////////////////// DELETE
descriptionGameRoutes[DELETE](
  '/describe/audio/:gameId/:messageId',
  ep(['describe','audio'],
  DELETE));

console.log(descriptionGameRoutes.stack);

module.exports = descriptionGameRoutes;
