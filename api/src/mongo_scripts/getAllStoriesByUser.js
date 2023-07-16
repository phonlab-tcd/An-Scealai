
// Get username and password from command line args
const username = process.argv[2];

console.log('username:', username);

if (!username) {
  console.error('arg1: studentId, arg2: username');
  process.exit(1);
}

const Story = require('../models/story');
const mongoose = require('mongoose');
const config = require('../DB');

mongoose.Promise = global.Promise;
//mongoose.set('useFindAndModify', false);


main = async () => {
  // Connect to mongodb
  await mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => {console.log('Database is connected');},
    (err) => {console.log('Cannot connect to the database. ',err)}
  );

  try {
    const stories = await Story.find({author: username});
    console.log(stories);
  } catch (error) {
    throw error;
  }
  process.exit(0);
}

try {
  main();
} catch (error) {
  console.error(error);
}
