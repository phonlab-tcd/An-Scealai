const { MongoMemoryServer } = require('mongodb-memory-server');
const   mongoose            = require('mongoose');

const mongodPromise = MongoMemoryServer.create();

const main = async ()=>{
  const mongodResult = await mongodPromise.then(ok=>({ok}),err=>({err}));
	if("err" in mongodResult){
		console.log(mongodResult);
	}
	const mongod = mongodResult.ok;
	console.log("got mongod");
  const uri = mongod.getUri();

	console.log(uri);

  await mongod.stop();
};

main()
