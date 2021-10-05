
const mail = require('../mail');

const sendingAt = new Date();
console.log(sendingAt);

mail.sendEmail({
	from: "scealai.info@gmail.com",
	recipients: "nrobinso@tcd.ie",
	subject: "TEST",
	message: "<h1>Hi everybody!<h1><p>This is just a test.</p>" + sendingAt,
});
