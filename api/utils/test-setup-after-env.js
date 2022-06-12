const mongoose = require('mongoose');
beforeAll(async()=>{
  const useNewUrlParser = true;
  const useUnifiedTopology = true;
  const opts = {useNewUrlParser,useUnifiedTopology};
  await mongoose.connect(process.env['MONGO_URI'],opts);
});
afterAll(async()=>{
  await mongoose.connection.close();
});
