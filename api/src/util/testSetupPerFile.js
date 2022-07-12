const { MongoMemoryServer } = require('mongodb-memory-server');
const   mongoose            = require('mongoose');

const mongodPromise = MongoMemoryServer.create();

beforeAll(async ()=>{
  console.log('BEFORE ALL');

  const mongod = await mongodPromise;
  const uri = mongod.getUri() + 'test';
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const opts = {useNewUrlParser,useUnifiedTopology};
  await mongoose.connect(uri,opts);

});

afterAll(async ()=>{
  const mongod = await mongodPromise;
  await mongod.stop();
});
