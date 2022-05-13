const nodemailer = require('nodemailer');
const sendinblue = require('./sendinblue');

// Much of the following code was taken from this tutorial:
// https://schadokar.dev/posts/how-to-send-email-in-nodejs/
const sendEmail = async (mailObj) => {
  const { from, recipients, subject, message } = mailObj;
  const transport = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: sendinblue.user,
      pass: sendinblue.pass,
    },
  });

  // send mail with defined transport object.
  return transport.sendMail({
    from: from,
    to: recipients,
    subject: subject,
    text: message,
  });
}
module.exports.sendEmail = sendEmail;
