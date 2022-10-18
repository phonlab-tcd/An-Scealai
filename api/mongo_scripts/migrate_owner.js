const User = require('../models/user');
const Story = require('../models/story');
const mongoose = require('mongoose');
const dbURL = require('../utils/dbUrl');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

(async () => {
    await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true}).then(
        () => {console.log('Database is connected')},
        (err) => {console.log('Cannot connect to the database.', err)}
    );

    // returns any stories for which either
    //  (i) owner property doesn't exist
    //  (ii) owner value is null
    const storiesWithoutOwners = await Story.find({
        "owner": null,
    });

    for (const story of storiesWithoutOwners) {
        const author = await User.findOne({"username": story.author});
        story.owner = author._id
        story.save();
    }

    process.exit(0);
})();