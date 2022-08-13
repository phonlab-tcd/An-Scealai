async function main() {
  const mongoose = require('mongoose');
  console.log('db:\t',process.env.db);
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.db}`);
  const Story = require('../models/story');
  const stories = await Story.find();
  await Promise.all(stories.map((story)=>{
    console.log(story._doc.studentId);
    console.log(story);
    return Story.updateOne({_id: story._id}, {$set: {owner: story._doc.studentId}});
  }));

  process.exit(0);
}
main();
