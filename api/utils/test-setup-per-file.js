const { MongoMemoryServer } = require('mongodb-memory-server');
const   mongoose            = require('mongoose');
const   randomString        = require('./randomString');

const mongodPromise = MongoMemoryServer.create();

beforeAll(async ()=>{
  const mongod = await mongodPromise;
  const uri = mongod.getUri() + randomString();
  console.log(uri);
  process.env.MONGO_URI = uri;
  console.log(process.env.MONGO_URI);
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const opts = {useNewUrlParser,useUnifiedTopology};
  await mongoose.connect(uri,opts);
});

afterAll(async ()=>{
  const mongod = await mongodPromise;
  await mongod.stop();
});
