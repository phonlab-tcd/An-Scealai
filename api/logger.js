

const winston = require('winston');
const fs = require('fs');
const path = require('path');


const errorFile = path.join(__dirname, 'logs/error.log')
const combinedFile = path.join(__dirname, 'logs/combined.log')


const myFormat = winston.format.printf( ({ level, message, timestamp, ...metadata}) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if(metadata) {
    msg += JSON.stringify(metadata)
  }
  return msg
});

// Create our logger object
const logger = winston.createLogger({
  format: 
      winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        myFormat
      ),
  transports: [
    // This transport lets us log to the console
    new winston.transports.Console(),
    // This transport logs to the error file
    new winston.transports.File({ filename: errorFile, level: 'error' }),
    // This transport should be were everything gets sent
    new winston.transports.File({ filename: combinedFile}),
  ]
});


module.exports = logger

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
