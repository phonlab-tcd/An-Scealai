
// Get username and password from command line args
const username = process.argv[2];

console.log('username:', username);

const Engagement = require('../models/event');
const mongoose = require('mongoose');
const config = require('../DB');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

main = async () => {
  // Connect to mongodb
  await mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => {console.log('Database is connected');},
    (err) => {console.log('Cannot connect to the database. ',err)}
  );

  // Find the user
  await Engagement.find({'storyData.author': username})
    .then(
       async (stories) => {
        for(let story of stories) {
          // Change the user's password
	  console.log(JSON.stringify(story.storyData));
        }
      },
      error => {
        console.log(JSON.stringify(error));
      });
  process.exit(0);
}


main();
