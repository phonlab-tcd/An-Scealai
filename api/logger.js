
var winston = require('winston');
var path = require('path');
// var stackify = require('stackify-logger');

require('winston-mongodb');


const errorFile = path.join(__dirname, 'logs/error.log');
const combinedFile = path.join(__dirname, 'logs/combined.log');
const uncaughtExceptionsFile = path.join(__dirname, 'logs/uncaughtExceptions.log');

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, ..._metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  return msg
});

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
    mongoTransport,
  ],

  exceptionHandlers: [
    new winston.transports.File({ filename: uncaughtExceptionsFile }),
  ],
});

module.exports = logger;
