const winston = require('winston');
const path = require('path');
const mongodb = require('mongodb');
// var stackify = require('stackify-logger');


process.on('uncaughtException', err => {
  console.error( "UNCAUGHT EXCEPTION" );
  console.error( "[Inside 'uncaughtException' event] ", err);
});

const errorFile = path.join(__dirname, 'logs/error.log');
const combinedFile = path.join(__dirname, 'logs/combined.log');
const uncaughtExceptionsFile = path.join(__dirname, 'logs/uncaughtExceptions.log');

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, ... metadata}) => {
    let string_message = JSON.stringify(message);
    let msg = `${timestamp} [${level}] : ${string_message}`;
    return msg;
  })

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
  ],

  levels:  { 
    emerg: 0, 
    alert: 1, 
    crit: 2, 
    error: 3, 
    warning: 4, 
    notice: 5, 
    info: 6, 
    debug: 7
  },

  exceptionHandlers: [
    new winston.transports.File({ filename: uncaughtExceptionsFile }),
  ],
});

require('winston-mongodb');

var preconnectedDB = null;
const client = mongodb.MongoClient.connect('mongodb://localhost:27017/scealai',
  { useUnifiedTopology: true, useNewUrlParser: true})
  .then( db => {
    logger.info('Winston has connected to MongoDB');
    const date = new Date();
    const shortDate = date.toLocaleString('en-gb', {weekday: 'short' })
      + date.toLocaleString('en-gb', { month: 'short' }) + date.getDate() + '_' +date.getHours() + ':' + date.getMinutes();
    preconnectedDB = db;
    var mongoTransport;
    mongoTransport =  new winston.transports.MongoDB({
      level: "info", // info is the default
      db: preconnectedDB, // user: logger, pwd: logger, db: logger
      collection: 'log', // default is 'log'
      options: { // modified version of default
        poolSize: 2, // default
        useNewUrlParser: true, // default
        // tryReconnect: true // default // not compatible with useUnifiedTopology: ture
        useUnifiedTopology: true, // not default
      }
    });
    logger.info("Adding MongoDB transport to logger");
    logger.add(mongoTransport);
  })
  .catch( err => {
    logger.error("FAILED TO CONNECT TO MONGODB. MONGODB TRANSPORT WILL NOT BE ADDED.", err.message);
  }); 

module.exports = logger;
