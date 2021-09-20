const MongoClient = require('mongodb').MongoClient;
const dbUrl = require('./dbUrl');
const config = require('../DB');

let db;
MongoClient.connect(dbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client) => {
      if (err) {
        console.log(
            'MongoDB Connection Error. ' +
            'Please make sure that MongoDB is running.');
        process.exit(1);
      }
      db = client.db(process.env.DB || config.DB);
      module.exports = db;
    });

