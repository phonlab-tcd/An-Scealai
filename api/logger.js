const winston = require('winston');
const path = require('path');
const mongodb = require('mongodb');
const mongoConfig = require('./DB');
// var stackify = require('stackify-logger');

// logger.error is console.error until the winston logger is created
var logger ={ error: console.error,
  log: console.log};

// TODO: I'm not sure if this line should be included
process.on('uncaughtException', err => {
  logger.error( "UNCAUGHT EXCEPTION" );
  logger.error( "[Inside 'uncaughtException' event] ", err);
});

const errorFile = path.join(__dirname, 'logs/error.log');
const combinedFile = path.join(__dirname, 'logs/combined.log');
const uncaughtExceptionsFile = path.join(__dirname, 'logs/uncaughtExceptions.log');

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata}) => {
    // TODO log the rest parameters in metadata
    let string_message = JSON.stringify(message);
    let msg = `${timestamp} [${level}] : ${string_message}`;
    return msg;
  })

// Create our logger object
logger = winston.createLogger({
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
  transports: [
    // This transport lets us log to the console
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({format: 'HH:mm:ss'}),
        consoleFormat
      )
    }),
    // This transport logs to the error file
    new winston.transports.File({ 
      level: 'error',
      filename: errorFile, 
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // This transport should be were everything gets sent
    new winston.transports.File({ 
      level: 'debug',
      filename: combinedFile,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],

  // All uncaught exceptions are logged to the uncaughtExceptionsFile
  exceptionHandlers: [
    new winston.transports.File({ filename: uncaughtExceptionsFile }),
  ],
});

require('winston-mongodb');

var preconnectedDB = null;
const client = mongodb.MongoClient.connect(mongoConfig.DB,
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
        // tryReconnect: true // default // not compatible with useUnifiedTopology: true
        useUnifiedTopology: true, // not default
      }
    });
    logger.info("Adding MongoDB transport to logger");
    logger.add(mongoTransport);
  })
  .catch( err => {
    logger.error("FAILED TO CONNECT TO MONGODB. MONGODB TRANSPORT WILL NOT BE ADDED.", err.message);
  }); 


// This should be deleted before merging the PR
//logger.emerg("this is just a test");
//logger.alert("this is just a test");
//logger.crit("this is just a test");
//logger.error("this is just a test");
//logger.warning("this is just a test");
//logger.notice("this is just a test");
//logger.info("this is just a test");
//logger.debug("this is just a test");

module.exports = logger;
