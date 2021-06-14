// readpassword.js

var read = require('read');


read(
  { prompt: "Trying to connect to MongoDB. Please provide password for user scealai.",
    silent: true,
  }, (err, result, isDefault) => {
  if(isDefault){
    console.log("No password provided. Exiting.");
    process.exit(1);
  }
  console.log("You entered the following password: ", result);
});
