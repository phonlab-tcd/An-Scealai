const logger = require('../logger.js');

const mail = require('../mail');
if(mail.couldNotCreate){
  logger.error('Failed to create mail module in ./api/controllers/authentication.js');
}

// Used to generate confirmation code to confirm email address
var jwt = require('jsonwebtoken');

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

const pendingRegEx = /^Pending$/;
const activeRegEx = /^Active$/;

module.exports.generateNewPassword = async (req, res) => {

  if( !req.query.username || !req.query.email || !req.query.code ){
    return res.status(400).json("Please provide username, email and code in url params!");
  }


  // Authenticate User
  const user = await User.findOne({ username: req.query.username, email: req.query.email })
    .catch(
      err => {
        logger.error(err);
      });

  if( !user ){
    return res.status(400).json("Username and email not found.");
  }

  if ( !user.status || user.status !== 'Active' ) {
    res.status(400).json('User status must be active to reset password');
  }

  if ( !user.resetPassword || !user.resetPassword.code || req.query.code !== user.resetPassword.code) {
    return res.status(400).json("Codes do not match. Refusing to change password.");
  }

  const new_password = user.generateNewPassword();
  user.setPassword(new_password);

  user.save().catch(err => { logger.error(err); });

  mailObj = {
    from: 'scealai.info@gmail.com',
    recipients: req.query.email,
    subject: 'New Password -- An Scéalaí',
    body: `Your An Scéalaí password has been reset.\nusername: ${req.query.username}\npassword: ${new_password}`
  }

  const mailRes = mail.sendEmail(mailObj);

  res.status(200).send(`<h1>Password reset successfully</h1><ul><li>username:${req.query.username}</li><li>password:${new_password}</li></ul>`);

}

module.exports.resetPassword = async (req, res) => {
  if ( !req.body.username ) {
    return res.status(400).json({
      messageKeys: ["Please provide a username in the query parameters."],
    });
  }

  if ( !req.body.baseurl ) {
    logger.warning("baseurl not provided. defaulting to dev server: http://localhost:4000/");
    req.body.baseurl = 'http://localhost:4000/';
  }
  
  try {
    var user = await User.findOne({username: req.body.username});
  } catch (err) {
    return res.status(400).json({
      messageKeys: ["Could not find user with username: " + req.body.username],
    });
  }

  if ( !user ) {
    return res.status(404).json({
      messageKeys: ['username_not_found'],
    });
  }

  if ( 
    !user.status 
    || user.status.match(pendingRegEx)
    || !user.status.match(activeRegEx)
    || !user.email ) {
    return res.status(400).json({
      messageKeys: ["user_not_verified_cannot_reset_password"],
    });
  }
  
  const resetPasswordLink = 
    user.generateResetPasswordLink(req.body.baseurl);

  // Update user's email and verification code on the db
  await user.save()
    .catch(err => {
      logger.error(err);
    });

  const mailObj = {
    from: 'scealai.info@gmail.com',
    recipients: [user.email],
    subject: 'An Scéalaí account verification',
    message: 
    `Dear ${user.username},\n\
      Please use this link to generate a new password for your account:\n\n\
      ${resetPasswordLink}\n\n\
      \n\
      Kindly,\n\
      \n\
      The An Scéalaí team`,
  }
  
  try {
    const sendEmailRes = await mail.sendEmail(mailObj);
    if (!sendEmailRes) {
      return res.status(500).json({
        messageKeys: [`There seems to have been error while trying to send an email to ${user.email}`],
      });
    }

    if (sendEmailRes.rejected.length && sendEmailRes.rejected.length !== 0) {
      return res.status(500).json({
        messageKeys: [`Failed to send verification email to ${sendEmailRes.rejected}.`],
      });
    }

    return res.status(200).json({
      messageKeys: [`email_sent`],
      sentTo: user.email,
    });
  } catch (err) {
    return res.status(500).json({
      messageKeys: [err.message]
    });

  }

}


async function sendVerificationEmail (username, password, email, baseurl) {
  return new Promise(async (resolve, reject) => {

    logger.info(`beginning sendVerificationEmail(${username}, password, ${email}, ${baseurl})`);

    // Authenticate User
    const user = await User.findOne({ username: username })
      .catch(
        err => {
          logger.error(err);
          reject(err);
        });

    // Require valid password
    if( !user.validPassword(password) ) {
      logger.error('Invalid password');
      reject({
        messageToUser: 'INVALID PASSWORD'
      });
    }

    user.email = email;

    const activationLink = user
      .generateActivationLink(baseurl);

    // Update user's email and verification code on the db
    await user.save()
      .catch(err => {
        reject(err);
      });

    mailObj = {
      from: 'scealai.info@gmail.com',
      recipients: [email],
      subject: 'An Scéalaí account verification',
      message: 
      `Dear ${user.username},\n\
      Please use this link to verify your email address for An Scéalaí:\n\n\
      ${activationLink}\n\n\
      Once you have verified your email you will be able to log in again.\n\
      \n\
      Kindly,\n\
      \n\
      The An Scéalaí team`,
    }

    let sendEmailErr = null;
    try {
      const sendEmailRes = await mail.sendEmail(mailObj);
      if (!sendEmailRes) {
        return reject({
          status: 404,
          messageToUser: `It seems the verification email failed to send`,
        });
      }

      if (sendEmailRes.rejected.length && sendEmailRes.rejected.length !== 0) {
        return reject({
          messageToUser: `Failed to send verification email to ${sendEmailRes.rejected}.`,
        });
      }
      return resolve({
        messageToUser: `A verification email has been sent to ${sendEmailRes.accepted}.`,
      });
    } catch (err) {
      logger.error({
        file: './api/controllers/authentication.js',
        functionName: 'sendVerificationEmail',
        error: err,
      });
      if (err.response) {
        console.log(err.response);
        return reject({
          messageToUser: err.response,
        });
      }
      return reject(err);
    }
  }); // end Promise constructor
} // end sendVerificationEmail

// Set a user's status to Active when they click on the activation link
module.exports.verify = async (req, res) => {
  if (!req.query.username){
    return res.status(400).json("username required to verify account email address");
  }
  if (!req.query.email){
    return res.status(400).json("email required to verify account email address");
  }
  if (!req.query.verificationCode){
    return res.status(400).json("verificationCode required to verify account email address");
  }

  const user = await User.findOne({username: req.query.username, email: req.query.email})
    .catch(err => {
      logger.error({
        error: err,
        endpoint: '/user/verify'
      });
    });
  
  if(!user){
    return res.status(404).json(`User with username: ${req.query.username} and email: ${req.query.email} does not exist.`);
  }

  if (user.verification.code === req.query.verificationCode) {
    user.status = 'Active';

    await user.save();

    return res
        .status(200)
        .send(
            '<h1>Success</h1><p>Your account has been verified.</p><ul>' +
            `<li>username: ${user.username}</li>` +
            `<li>verified email: ${user.email}</li>` +
            '</ul><p>');
  }


  res.status(200).send('<h1>Sorry</h1><p>That didn\'t work.</p>');
};

module.exports.verifyOldAccount = async (req, res) => {
  try {
    const resObj = {
      messageKeys: [],
      errors: [],
    };
    // API CALL REQUIREMENTS
    if (!req.body.username || !req.body.email || !req.body.password) {
      resObj.messageKeys.push(
          'username_password_and_email_required',
      );
      return res.status(400).json(resObj);
    }
    if (!req.body.baseurl) {
      logger.warning('baseurl not provided to verifyOldAccount. Defaulting to dev server: http://localhost:4000/');
      req.body.baseurl = 'http://localhost:4000/';
    }

    logger.info('Beginning verification of ' + req.body.username);

    const user = await User.findOne({username: req.body.username})
        .catch((error) => {
          return res.status(404).json({
            messageKeys:
            ['There was an error while trying to find a user with username: ' +
              req.body.username],
            error: error,
          });
        });

    if (!user) {
      return res.status(40).josn('User not found');
    }

    if (user.status === 'Active') {
      if (user.email) {
        return res
            .status(400)
            .json(
                `User: ${user.username} is already verified with \
                the email address: ${user.email}. \
                If you think this is a mistake please \
                let us know at scealai.info@gmail.com`);
      }
      // if !user.email && user.status === 'Active'
      logger.warning(
          `User: ${user.usernam} was Active but \
          had no assoctiated email address. \
          Resetting to Pending`);
      try {
        user.status = 'Pending';
        await user.save();
        return res
            .status(500)
            .json({
              file: './api/controllers/authentication.js',
              functionName: 'verifyOldAccount',
              messageKeys:
              ['There was an error on our server. ' +
               'We failed to update your status to Pending.'],
            });
      } catch (err) {
        logger.error({
          endpoint: '/user/verifyOldAccount',
          error: err,
        });
      }
    }

    try {
      const mailRes =
        await sendVerificationEmail(
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.baseurl);

      console.log('mailRes:', mailRes);

      // IF ALL GOES WELL
      return res.status(200).json({
        messageKeys: ['User activation pending. Please check your email inbox'],
      });
    } catch (mailErr) {
      console.dir(mailErr);
      logger.error('mailErr', mailErr);
      resObj.messageKeys.push(
          'An error occurred while trying to send a verification email.');
      if (mailErr.messageToUser) {
        resObj.messageKeys.push(mailErr.messageToUser);
      }
      return res
          .status(500)
          .json(resObj);
    }
  } catch (error) {
    const messageKeys = ['An unknown error occurred'];
    console.dir(error);
    if (error.messageToUser) {
      messageKeys.push(error.messageToUser);
    }
    return res
        .status(500)
        .json({messageKeys: messageKeys,
          file: '.api/controllers/authentication.js',
          functionName: 'verifyOldAccount',
          error: error,
        });
  }
};

module.exports.register = async (req, res) => {
  let resObj = {
    messageKeys: [],
    errors: [],
  };

  // REQUIREMENTS
  if(!req.body.username || !req.body.password || !req.body.email) {
    resObj.messageKeys.push("username_password_and_email_required");
    return res.status(400).json(resObj);
  }
  if(!req.body.baseurl){
    logger.warning('Property basurl missing from registration request. Using default (dev server)');
    req.body.baseurl = 'http://localhost:4000/';
  }

  var user = new User();

  user.username = req.body.username;

  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.role = req.body.role;

  try {
    await user.save();
  } catch (err) {
    resObj.errors.push(err);
    logger.error(err);
    if(err.code){
      logger.error("Mongo error. Error code: " + err.code);
      if (err.code === 11000) {
        return res.status(400).json({
          messageKey: "username_taken_msg"
        });
      } 
    }
  }

  try {
    await sendVerificationEmail(
      user.username, 
      req.body.password, 
      user.email,
      req.body.baseurl);
  } catch (err) {
    resObj.errors.push(err.messageToUser);
    return res.status(500).json(resObj);
  }

  return res.status(200).json({
    messageKey:'verification_email_sent'
  });
};



module.exports.login = function(req, res) {
  let resObj = {
    userStatus: null,
    messageKeys: [],
    errors: [],
  }

  if(!req.body.username || !req.body.password) {
    resObj.messageKeys.push('username_and_password_required');
    return res
      .status(400)
      .json(resObj);
  }

  // AUTHENTICATE
  passport.authenticate('local', function(err, user, info) {
    if(err) {
      logger.error(err);
      resObj.errors.push(err);
    }

    if(!user){
      resObj.messageKeys.push(info.message);
      return res.status(400).json(resObj);
    }

    if(!user.validStatus()){
      logger.error('User,' + user.username + 'has an invalid no status property');
      resObj.errors.push('Invalid status: ' + ( user.status ? user.status : undefined ));
      user.status = 'Pending';
      user.save().catch(err => { 
        logger.error(JSON.parse(JSON.stringify(err)));
        resObj.errors.push(JSON.stringify(err));});
    }

    console.log(user.status);
    if(user.status.match(pendingRegEx)){
      resObj.messageKeys.push('email_not_verified')
      resObj.userStatus = user.status;
      return res.status(400).json(resObj);
    }
    else if (user.status.match(activeRegEx)) {
      logger.info('User ' + user.username + ' authenticated and status is Active. Sending json web token.');
      resObj.token = user.generateJwt();
      return res
        .status(200)
        .json(resObj);
    } 

    // ELSE
    // TODO throw new Error()
    logger.error('User, ' + user.username + ' has an invalid status: ' + user.status + '. Should be Pending or Active.');
    return res.status(500).json(resObj);

  })(req, res);
  // DON'T PUT ANYTHING AFTER passport.authenticate CALLBACK
};
