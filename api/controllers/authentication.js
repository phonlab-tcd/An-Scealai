const logger = require('../logger.js');
const {verifyJwt} = require('../utils/jwtTools');
const { oneWeekFromNowMs } = require('../utils/time');
const mail = require('../mail');
if(mail.couldNotCreate){
  logger.error('Failed to create mail module in ./api/controllers/authentication.js');
}

// Used to generate confirmation code to confirm email address
var jwt = require('jsonwebtoken');
const path = require('path');

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

pendingRegEx = /^Pending$/;
activeRegEx = /^Active$/;
// /<pattern>/i => ignore case
validUsernameRegEx = /^[a-z0-9]+$/i;

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


async function sendVerificationEmail(username, password, email, baseurl, language) {
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
      .generateActivationLink(baseurl, language);

    // Update user's email and verification code on the db
    await user.save()
      .catch(err => {
        reject(err);
      });

    const emailMessage = (language === 'ga') ? 
      // as gaeilge 
      `A ${user.username}, a chara,\n\
      Úsáid an nasc seo a leanas chun do sheoladh rphoist a dheimhniú, le do thoil:\n\n\
      ${activationLink}\n\n\
      A luaithe is a dheimhníonn tú do sheoladh rphoist beidh tú in ann logáil isteach arís.\n\
      \n\
      Le gach dea-ghuí,\n\
      \n\
      Foireann An Scéalaí`
      :
      // in english
      `Dear ${user.username},\n\
      Please use this link to verify your email address for An Scéalaí:\n\n\
      ${activationLink}\n\n\
      Once you have verified your email you will be able to log in again.\n\
      \n\
      Kindly,\n\
      \n\
      The An Scéalaí team`;

    mailObj = {
      from: 'scealai.info@gmail.com',
      recipients: [email],
      subject: 'An Scéalaí account verification',
      message: emailMessage,
    };

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
  const payload = await verifyJwt(req.query.jwt);
  const user = await User.findById(payload._id);
  
  if(!user)
    return res.status(404).json(`User with id: ${payload._id} not found`);

  user.status = 'Active';
  await user.save();

  return res
    .status(200)
    .sendFile(path.join(__dirname, '../views/account_verification.html'));
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
          req.body.baseurl,
          req.body.language,
        );

      // IF ALL GOES WELL
      return res.status(200).json({
        messageKeys: ['User activation pending. Please check your email inbox'],
      });
    } catch (mailErr) {
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
  const resObj = {
    messageKeys: [],
    errors: [],
  };

  // REQUIREMENTS
  if (!req.body.username || !req.body.password || !req.body.email) {
    resObj.messageKeys.push('username_password_and_email_required');
    return res.status(400).json(resObj);
  }
  if (!req.body.baseurl) {
    logger.warning(
        'Property basurl missing from registration request.' +
        'Using default (dev server).');
    req.body.baseurl = 'http://localhost:4000/';
  }

  if (!req.body.username.match(validUsernameRegEx)) {
    resObj.messageKeys.push('username_no_special_chars');
    return res.status(400).json(resObj);
  }

  const user = new User();

  user.username = req.body.username;

  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.role = req.body.role;

  try {
    await user.save();
  } catch (err) {
    resObj.errors.push(err);
    logger.error(err);
    if (err.code) {
      logger.error('Mongo error. Error code: ' + err.code);
      if (err.code === 11000) {
        resObj.messageKeys.push('username_taken_msg');
        return res
            .status(400)
            .json(resObj);
      }
    }
  }

  try {
    await sendVerificationEmail(
        user.username,
        req.body.password,
        user.email,
        req.body.baseurl,
        req.body.language || 'en',
    );
  } catch (err) {
    logger.error(err);
    resObj.errors.push(err);
    if (err.messageToUser) {
      resObj.messageKeys.push(err.messageToUser);
    }
    return res.status(500).json(resObj);
  }

  return res.status(200).json(resObj);
};


module.exports.login = function(req, res, next) {
  // assume passport.authenticate('local') has succeeded
  const user = req.user;
  const resObj = {
    userStatus: null,
    messageKeys: [],
    errors: [],
    verificationStatus: user.status,
  }

  if(!user.validStatus()){
    resObj.errors.push('Invalid status: ' + ( user.status ? user.status : undefined ));
    user.status = 'Pending';
    user.save();
  }

  if(user.status.match(pendingRegEx)){
    resObj.messageKeys.push('email_not_verified')
    return res.status(400).json(resObj);
  }
  else if (user.status.match(activeRegEx)) {
    res.status(200).json({
      token: {
        token: 'Bearer ' + user.generateJwt(),
        expires: oneWeekFromNowMs(),
      },
      user: user,
    });
    return user.loginEvent();
  } 
  return res.status(500);
};
