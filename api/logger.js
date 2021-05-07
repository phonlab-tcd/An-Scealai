

const winston = require('winston')


// Create our logger object
const logger = winston.createLogger({
  transports: [
    // This transport lets us log to the console
    new winston.transports.Console(),
    // This transport logs to the error file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // This transport should be were everything gets sent
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ]
});


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
