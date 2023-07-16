const User = require('../models/user');
const mongoose = require('mongoose');
const config = require('../DB');
const Story = require('../models/story');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

main = async () => {
  // Connect to mongodb
  await mongoose.connect(config.DB, {useNewUrlParser: true, useUnifiedTopology: true}).then(
      () => {
        console.log('Database is connected');
      },
      (err) => {
        console.log('Cannot connect to the database. ', err);
      },
  );

  // Find the user
  await User.find()
      .then(
          async (users) => {
            if (users) {
              for (const user of users) {
                const oldStories = await Story.find({'author': user.username, 'owner': {$exists: false}});

                if (oldStories) {
                  for (const story of oldStories) {
                    console.log(story.title);
                    story.owner = new mongoose.mongo.ObjectId(user._id);
                    await story.save();
                  }
                }
              }
            } else {
              console.log('Users not found');
            }
          },
          (error) => {
            console.error(error);
          });
  process.exit(0);
};


main();
