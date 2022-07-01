const nodemailer = require("nodemailer");
const logger = require('./logger');
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

// send mail with defined transport object.
if(process.env.NO_EMAILS) {
  console.log('NO_EMAILS: sendEmail neutered');
  module.exports.sendEmail = ()=>true;
} 
else {
  if(!process.env.SENDINBLUE_USERNAME || !process.env.SENDINBLUE_PASSWORD){
    logger.error("env vars SENDINBLUE_USER and SENDINBLUE_PASS are required");
    process.exit(1);
  }
  try{
    const sendEmail = async (mailObj) => {
      const { from, recipients, subject, message } = mailObj;
      try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
          host: "smtp-relay.sendinblue.com",
          port: 587,
          auth: {
            user: process.env.SENDINBLUE_USERNAME,
            pass: process.env.SENDINBLUE_PASSWORD,
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
    console.error(`Failed to create email transport in ${__filename}. Have you created ${filepath}?`);
    console.error(err);
    module.exports.sendEmail = null;
    module.exports.couldNotCreate = true;
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
