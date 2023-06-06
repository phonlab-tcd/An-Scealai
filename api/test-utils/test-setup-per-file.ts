import { beforeAll, afterAll } from "@jest/globals";

const { MongoMemoryServer } = require('mongodb-memory-server');
const   mongoose            = require('mongoose');

const mongodPromise = MongoMemoryServer.create();

beforeAll(async ()=>{
  const mongodResult = await mongodPromise.then(ok=>({ok}),err=>({err}));
	if("err" in mongodResult){
		console.log("ERROR CREATING MEMORY SERVER",mongodResult);
	}
	const mongod = mongodResult.ok;
  const uri = mongod.getUri();
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const opts = {useNewUrlParser,useUnifiedTopology};
  await mongoose.connect(uri,opts);
});

afterAll(async ()=>{
  const mongod = await mongodPromise;
  await mongod.stop();
});
