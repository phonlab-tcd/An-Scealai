function sendinblue_setup() {
  const sendinblue = require('./sendinblue.json');
  process.env.SENDINBLUE_PASSWORD = sendinblue.pass;
  process.env.SENDINBLUE_USERNAME = sendinblue.user;
}

function main() {
  sendinblue_setup();
  require('./dist/api/src/server');
}

main();
