const mongoose = require('mongoose');
beforeAll(async ()=>{
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const opts = {useNewUrlParser,useUnifiedTopology};
  await mongoose.connect(global.__MONGO_URI__,opts);
});
afterAll(async ()=>{
  await mongoose.connection.close();
});
