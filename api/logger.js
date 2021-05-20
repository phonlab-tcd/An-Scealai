
/*
const mongoose = require('mongoose'),
  config = require('./DB');
*/


var winston = require('winston');
var path = require('path');
// var stackify = require('stackify-logger');

require('winston-mongodb');


const errorFile = path.join(__dirname, 'logs/error.log');
const combinedFile = path.join(__dirname, 'logs/combined.log');
const uncaughtExceptionsFile = path.join(__dirname, 'logs/uncaughtExceptions.log');

const consoleFormat = winston.format.printf( ({ level, message, timestamp, ..._metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  return msg
});

/*
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useUnifiedTopology: true, useNewUrlParser: true }).then(
    () => {cosole.log('Database is connected');},
    (err) => { console.log('Cannot connect to the database:' + err)}
);
*/
const mongoTransport =  new winston.transports.MongoDB({
  level: "info", // info is the default
  db: 'mongodb://localhost:27017/an-scealai',
  collection: "log", // default
  options: { // modified version of default
    poolSize: 2, // default
    useNewUrlParser: true, // default
    // tryReconnect: true // default // not compatible with useUnifiedTopology: ture
    useUnifiedTopology: true, // not default
  }
});

console.log(mongoTransport);

// Create our logger object
const logger = winston.createLogger({
  transports: [
    // This transport lets us log to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        consoleFormat
      )
    }),
    // This transport logs to the error file
    new winston.transports.File({ filename: errorFile, level: 'error' }),
    // This transport should be were everything gets sent
    new winston.transports.File({ filename: combinedFile}),

    new winston.transports.MongoDB({
      level: "info", // info is the default
      db: 'mongodb://localhost:27017/an-scealai',
      collection: "log", // default
      options: { // modified version of default
        poolSize: 2, // default
        useNewUrlParser: true, // default
        // tryReconnect: true // default // not compatible with useUnifiedTopology: ture
        useUnifiedTopology: true, // not default
      }
    })
  ],

  exceptionHandlers: [
    new winston.transports.File({ filename: uncaughtExceptionsFile }),
  ],
});

module.exports = logger;

// Demo This Logger:
/*
const express = require('express');
const app = express()
const port = 3000;

const handler = (func) => (req, res) => {
  try{
    logger.info('server.handler.begun');
    func(req, res, logger);
  } catch(e){
    logger.error('server.handler.failed');
    res.send('Oh no, something did not go well!');
  }
};


app.get('/success', handler((req, res) => { res.send('Yay!'); }))
app.get('/error', handler((req, res) => { throw new Error('Doh!');}))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
*/
