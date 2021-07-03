
// Get username and password from command line args
const username = process.argv[2];
let status = process.argv[3];

console.log('username:',username,'\nstatus:',status);

let statusEnumRegex = /^(Active|Pending)$/;

if ( !status.match(statusEnumRegex)) {
  let activeShorthandRegex = /^(a)$/i;
  let pendingShorthandRegex = /^(p)$/i;
  if ( status.match(activeShorthandRegex) ) {
    status = 'Active';
  } else if(status.match(pendingShorthandRegex)) {
    status = 'Pending';
  } else {
    console.log(
      'given status [',status,'] does not match the regex',
      statusEnumRegex.toString(), ' or',
      statusShorthandRegex.toString() + '. Refusing to continue.');
    process.exit(1);
  }
}

const User = require('../models/user');
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
  await User.findOne({username: username})
    .then(
      async (user) => {
        if (user) {
          // Change the user's status
          user.status = status;
          await user.save();
          console.log(user.username +'\'s status is:',user.status);
        } else {
          console.log('User not found');
        }
      },
      error => {
        console.error(error);
      });
  process.exit(0);
}


main();
