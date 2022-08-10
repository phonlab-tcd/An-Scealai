const nodemailer = require("nodemailer");
// Much of the following code was taken from this tutorial:
// https://schadokar.dev/posts/how-to-send-email-in-nodejs/
/**
 * sendEmail
 * @param {Object} mailObj - Email meta data and body
 * @param {String} from - Email address of the sender
 * @param {Array} recipients - Array of recipients email address
 * @param {String} subject - Subject of the email
 * @param {String} message - message
 */
const path = require('path');
const fs = require('fs');

// send mail with defined transport object.
if(process.env.NO_EMAILS) {
  console.log('NO_EMAILS: sendEmail neutered');
  module.exports.sendEmail = ()=>true;
} else {
  try{
    console.log("Attempting to read sendinblue auth data from ./api/sendinblue.json");
    let rawdata = fs.readFileSync(path.join(__dirname, 'sendinblue.json'));
    let sendinblueData = JSON.parse(rawdata);
    const sendEmail = async (mailObj) => {
      const { from, recipients, subject, message } = mailObj;
      try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
          host: "smtp-relay.sendinblue.com",
          port: 587,
          auth: {
            user: sendinblueData.user,
            pass: sendinblueData.pass,
          },
        });

        let mailStatus = await transporter.sendMail({
          from: from,
          to: recipients,
          subject: subject,
          text: message,
        });

        return mailStatus;

      } catch(error) {
        console.error(error);
        throw error;
      }
    }

    module.exports.sendEmail = sendEmail;

  } catch(err) {
    console.error(err);
    console.error("Failed to create email transport in ./api/mail.js. Have you created sendinblue.json ?");
    process.exit(1);
  }
}
/* EXAMPLE OF HOW TO USE THE sendEmail function
const mailObj = {
  from: "nrobinso@tcd.ie",
  recipients: ["scealai.info@gmail.com"],
  subject: "TEST 2 -- With passwords hidden -- This was send by nodejs",
  message: "Hi everybody!",
};

sendEmail(mailObj).then((res) => {
  console.log(res);
});
*/
