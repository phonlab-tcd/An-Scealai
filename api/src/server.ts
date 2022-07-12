async function main() {
  require('dotenv').config();
  await require('./util/export_keypair');
  const app = require('./app_factory')();
  const shouldConnect = process.env.NODE_ENV !== 'test';
  if(shouldConnect) {
    if(process.env.IN_MEMORY_DB) await connectInMemoryDb();
    else await connectDb();
    const logger = require('./util/logger');
    const port = process.env.PORT || 4000;
    app.listen(port,()=>logger.info(`Listening on port ${port}`));
  }
  return app;
}

async function connectInMemoryDb() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoose = require('mongoose');
  const mongodPromise = MongoMemoryServer.create();
  const mongod = await mongodPromise;
  const uri = mongod.getUri() + 'test';
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const opts = {useNewUrlParser,useUnifiedTopology};
  await mongoose.connect(uri,opts);
  const logger = require('./util/logger');
  logger.info(`connected to in memory server: ${uri}`);
}

async function connectDb() {
  const mongoose          = require('mongoose');
  const dbURL             = require('./util/dbUrl');
  const opts = {
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: process.env.TIMEOUT,
  };
  await mongoose.connect(dbURL, opts);
  const logger = require('./util/logger');
  logger.info(`connected ${dbURL}`);
}


module.exports = main();
