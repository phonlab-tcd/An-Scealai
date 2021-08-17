
// Get username and password from command line args
const studentId = process.argv[2];
const username = process.argv[3];

console.log('studentId:', studentId);
console.log('username:', username);

if (!studentId || !username) {
  console.log('arg1: studentId, arg2: username');
  process.exit(1);
}

const Engagement = require('../models/event');
const User = require('../models/user');
const Story = require('../models/story');
const mongoose = require('mongoose');
const config = require('../DB');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

function mostRecentStory(arrayOfStories) {
  if (!arrayOfStories instanceof Array) {
    throw new Error('arrayOfStories must be an array');
  }
  if (arrayOfStories.length < 1) {
    throw new Error('arrayOfStories.length must be greater than 0');
  }
  let mostRecent = arrayOfStories[0];
  let mostRecentDate = new Date(mostRecent.lastUpdated);
  for (let i = 1; i < arrayOfStories.length; i++) {
     let checkDate = new Date(arrayOfStories[i].lastUpdated);
     if (checkDate > mostRecentDate) {
        mostRecentDate = checkDate;
        mostRecent = arrayOfStories[i];
     }
  }

  return mostRecent;
}

main = async () => {
  // Connect to mongodb
  await mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => {console.log('Database is connected');},
    (err) => {console.log('Cannot connect to the database. ',err)}
  );

  const o = {};
  // Find the user
  try {
    o.user = await User.find({username});
    if (o.user.length != 1) {
      throw new Error(
        `Found ` + 
        o.user.length +
        ` users with userame ` +
        username +
        `. Refusing to continue.`);
    }
    o.user = o.user[0];
    o.recipientId = o.user._id.toString();
    o.recipientUsername = o.user.username;
  } catch (error) {
    throw error;
  }

  try {
    o.engagementStories = await Engagement.find({'storyData.studentId': studentId});
    console.log('Stories found: ', o.engagementStories.length);
  } catch (error) {
    throw error;
  }

  try {
    let storyIds = {};
    await o.engagementStories.forEach(async (e) => {
      const newStory = e.storyData;
      if (storyIds[newStory._id]) {
        storyIds[newStory._id]++;
      } else {
        storyIds[newStory._id] = 1;
      }
    });
    console.log('NUMBER OF STORIES WITH NO _id', (storyIds['undefined'] ? storyIds['undefined'] : 0));
    delete storyIds['undefined'];
   
    console.dir(storyIds);

    try {
      for (const id of Object.keys(storyIds)) {
        try {
          const stories = await Engagement.find({"storyData._id": id})
          const latestStory = mostRecentStory(stories).storyData
 	  console.dir(latestStory);
          delete latestStory._id;
          latestStory.author = o.user.username;
          latestStory.studentId = o.user._id.toString();
	  latestStory.title = 'RECOVERED: ' + latestStory.title;
          await Story.create(latestStory);
          console.count('Story Created');
        } catch(error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
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
