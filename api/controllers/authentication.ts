// @ts-nocheck
/* eslint-disable max-len */
const logger = require('../logger.js');
const path = require('path');
const mongoose = require('mongoose');
const User = mongoose.model('User');
// /<pattern>/i => ignore case

import * as aws_ses from "../utils/aws-ses-send-email";
import obscure_email_address from "../utils/obscure_email_address";

/**
 * Generate a new password for a given user
 * @param {Object} req query: Username, email, and reset password code generated in user model
 * @param {Object} res object to return response
 * @return {Promise} HTML for password reset message
 */
module.exports.generateNewPassword = async (req, res) => {
  if ( !req.query.username || !req.query.email || !req.query.code ) {
    return res.status(400).json('Please provide username, email and code in url params!');
  }

  // Get user from DB
  const user = await User.findOne({username: req.query.username, email: req.query.email})
      .catch(
          (err) => {
            logger.error(err);
          });

  if ( !user ) {
    return res.status(400).json('Username and email not found.');
  }

  if ( !user.status || user.status !== 'Active' ) {
    res.status(400).json('User status must be active to reset password');
  }

  if ( !user.resetPassword || !user.resetPassword.code || req.query.code !== user.resetPassword.code) {
    return res.status(400).json('Codes do not match. Refusing to change password.');
  }

  // generate new random password
  const newPassword = user.generateNewPassword();
  user.setPassword(newPassword);


  const mailOpts = aws_ses.send_mail_opts({
    to: req.query.email,
    subject: 'New Password -- An Scéalaí',
    text: `Your An Scéalaí password has been reset.\nusername: ${req.query.username}\npassword: ${newPassword}`,
  });

  // send email with new random password
  const mail_response = await aws_ses.send_mail_aws(mailOpts).then(ok=>({ok}), err=>({err}));

  if ("ok" in mail_response) {
    const user_save_result = await user.save().then(ok=>({ok}), err=>({err}))
    if("ok" in user_save_result) {
      return res.status(200).send(`<h1>Password reset successfully</h1><p>Please check your email (the email may end up in the spam folder).</p>`);
    } else {
      console.error({mail_response, user_save_result});
      return res.send("<p>Failed to update user record. We have sent you an email with a new password, but we failed to update you record. This means the password we sent you will not work! Please try again.</p>");
    }
  } else {
    console.error({mail_response});
    return res.send("<p>Failed to send email. Your password was not updated because we failed to send you your new password. Please try again.</p>");
  }
};


/**
 * Reset the password for a given user
 * @param {Object} req body: Username, baseUrl
 * @param {Object} res object to return response
 * @return {Promise} Success or error message
 */
module.exports.resetPassword = async (req, res) => {
  if ( !req.body.username ) {
    return res.status(400).json({
      messageKeys: ['Please provide a username in the query parameters.'],
    });
  }

  if ( !req.body.baseurl ) {
    logger.warning('baseurl not provided. defaulting to dev server: http://localhost:4000/');
    req.body.baseurl = 'http://localhost:4000/';
  }

  // get user from DB by username
  try {
    var user = await User.findOne({username: req.body.username});
  } catch (err) {
    return res.status(400).json({
      messageKeys: ['Could not find user with username: ' + req.body.username],
    });
  }

  if ( !user ) {
    return res.status(404).json({
      messageKeys: ['username_not_found'],
    });
  }

  // check user has certain properties set: an email, active or pending status
  if (
    !user.status ||
    user.status !== "Active" ||
    !user.email ) {
    return res.status(400).json({
      messageKeys: ['user_not_verified_cannot_reset_password'],
    });
  }

  // Generate a reset password link for the user
  const resetPasswordLink = user.generateResetPasswordLink(req.body.baseurl);

  await user.save()
      .catch((err) => {
        logger.error(err);
      });

  const mailOpts = aws_ses.send_mail_opts({
    to: user.email,
    subject: 'An Scéalaí account verification',
    text:
    `Dear ${user.username},\n\
      Please use this link to generate a new password for your account:\n\n\
      ${resetPasswordLink}\n\n\
      \n\
      Kindly,\n\
      \n\
      The An Scéalaí team`,
  });

  // make email private for display by replacing characters with ***
  const hiddenEmail = obscure_email_address(user.email);

  // send the email
  const send_email_result = await aws_ses.send_mail_aws(mailOpts).then(ok=>({ok}), err=>({err}));

  if (!("ok" in send_email_result)) {
    return res.status(500).json({
      messageKeys: [`There seems to have been error while trying to send 
        an email to ${hiddenEmail}`],
    });
  }

  return res.status(200).json({
    messageKeys: [`email_sent`],
    sentTo: hiddenEmail,
  });
};

/**
 * Set a user's status to Active when they click on the activation link
 * @param {Object} req query: username, email, verification code
 * @param {Object} res
 * @return {Promise} Success or error message
 */
module.exports.verify = async (req, res) => {
  console.log("/user/verify");
  if (!req.query.username) {
    return res.status(400).json('username required to verify account email address');
  }
  if (!req.query.email) {
    return res.status(400).json('email required to verify account email address');
  }
  if (!req.query.verificationCode) {
    return res.status(400).json('verificationCode required to verify account email address');
  }

  const user = await User.findOne({username: req.query.username, email: req.query.email})
      .catch((err) => {
        logger.error({
          error: err,
          endpoint: '/user/verify',
        });
      });

  if (!user) {
    return res.status(404).json(`User with username: ${req.query.username} and email: ${req.query.email} does not exist.`);
  }

  if (user.verification.code === req.query.verificationCode) {
    user.status = 'Active';

    await user.save();

    return res
        .status(200)
        .sendFile(path.join(__dirname, '../views/account_verification.html'));
  }

  res.status(200).send('<h1>Sorry</h1><p>That didn\'t work.</p>');
};