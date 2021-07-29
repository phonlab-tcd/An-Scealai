
const myArgs = process.argv.slice(2);

const outputFile = myArgs[0];

const User = require('../models/user');
const mongoose = require('mongoose');
const config = require('../DB');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const fs = require('fs');
const stream = fs.openSync(outputFile, 'a');

main = async () => {
  // Connect to mongodb
  await mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true}).then(
    () => {console.log('Database is connected');},
    (err) => {console.log('Cannot connect to the database. ',err)}
  );

  // Find the user
  await User.find({status: 'Active'}, {'email': 1})
    .then(
       async (users) => {
	let emails = {}
	let duplicates = {};
        for(let user of users) {
	  if (emails[user.email]) {
            emails[user.email]++;
 	    duplicates[user.email] = emails[user.email];
	  } else {
	    emails[user.email] = 1;
	    fs.writeSync(stream, `${user.email}\n`);
	  }
        }
	console.dir(emails);
	console.log('Total number of unique emails: ', Object.keys(emails).length);
	console.log('Duplicates: ');
	console.dir(duplicates);
      },
      error => {
	throw error;
      });
  process.exit(0);
}


main();
