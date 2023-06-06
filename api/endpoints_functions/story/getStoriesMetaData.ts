const Story = require('../../models/story');
const User = require('../../models/user');
const mongoose = require('mongoose');
const {API404Error} = require('../../utils/APIError');

// get stories by owner (user) ID and add property if it doesn't exist
export default async function getStoriesMetaDataHandler(req, res) {
  console.log("getStoriesMetaData params", req.params);
  const user = await User.findOne({'_id': req.params.ownerId}).then(ok=>({ok}),err=>({err}));
  if ("err" in user || !user.ok) {
    throw new API404Error("No such user:", req.params.ownerId);
  }
  const oldStories = await Story.find({'author': user.ok.username, 'owner': {$exists: false}});

  // add the 'owner' property to any stories that don't have it
  if (oldStories) {
    for (const story of oldStories) {
      story.owner = mongoose.Types.ObjectId(req.params.ownerId);
      try {
        await story.save();
      }
      catch {
        console.log('ownerId.js: This story id might be a string, cannot set owner property: ', story._id);
      }
    }
  }

//   export class StoryMetaData extends Serializable {
//     _id: string;
//     title: string;
//     date: Date;
//     lastUpdated: Date;
//     studentId: string;
// }

  const stories = await Story
    .find({'owner': req.params.ownerId})
    .select({
      "_id": 1,
      "title": 1,
      "date": 1,
      "lastUpdated": 1,
      "studentId": 1,
      "feedback": 1,
    });


  if (!stories) {
    throw new API404Error(`No stories written by user with id ${req.params.ownerId} were found.`);
  }
  return res.status(200).json(stories);
};