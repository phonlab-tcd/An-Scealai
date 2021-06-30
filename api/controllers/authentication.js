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


async function sendVerificationEmail (username, password, email, baseurl) {
  logger.info(`beginning sendVerificationEmail(${username}, password, ${email}, ${baseurl})`);
  // Authenticate User
  let getUserErr, user = null;
  await User.findOne({ username: username }, (err, userFound) => {
    logger.info({
      message: 'verifying user' + userFound.toString() });
    getUserErr = err;
    user = userFound;
  });

  if (getUserErr) {
    logger.error(getUserErr);
    return {
      error: getUserErr,
      success: null,
    };
  }

  if (!user) {
    logger.error('User not found');
    return {
      error: 'User not found',
      success: null,
    }
  }

  // Require valid password
  if( !user.validPassword(password) ) {
    logger.error('Invalid password');
    return {
      error: 'Invalid password',
      success: null,
    }
  }
        
  user.email = email;

  const activationLink = user
    .generateActivationLink(baseurl);

  await user.save();

  console.log("Confirmation Code:", user.confirmationCode);

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

  let sendEmailErr, sendEmailRes = null;
  sendEmailRes = await mail.sendEmail(mailObj)
    .catch(err => {
      sendEmailErr = err;
    });

  console.log('sendEmailRes:',sendEmailRes);

  if (sendEmailErr) {
    logger.error({
      file: './api/controllers/authentication.js',
      functionName: 'sendVerificationEmail',
      error: sendEmailErr,
    });
    return {
      error: sendEmailErr,
      success: null };
  }

  if ( sendEmailRes.rejected.length !== 0) {
    return {
      error: new Error('The following recipients were rejected: ', sendEmailRes.rejected),
      success: null};
  }

  return { 
    error: null, 
    success: sendEmailRes };
}

// Set a user's status to Active when they click on the activation link
module.exports.verify = async (req, res) => {
  if (!req.query.username){
    return res.status(400).json("username required to verify account email address");
  }
  if (!req.query.email){
    return res.status(400).json("email required to verify account email address");
  }
  if (!req.query.confirmationCode){
    return res.status(400).json("confirmatioCode required to verify account email address");
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

  if(user.confirmationCode === req.query.confirmationCode){
    const updatedUser = 
      await User.findOneAndUpdate({
        // Find
        username: req.query.username, 
        email: req.query.email}, 
        // Update
        {status: 'Active'}, 
        // Options
        {new: true});
    console.dir("User Activated: ", updatedUser);
    return res.status(200).send('<h1>Success</h1><p>Your account has been verified.</p><ul>' +
      `<li>username: ${updatedUser.username}</li>` +
      `<li>verified email: ${updatedUser.email}</li>` +
      '</ul><p>');
  }


  res.status(200).send('<h1>Sorry</h1><p>That didn\'t work.</p>');
}

module.exports.verifyOldAccount = async (req, res) => {
  try {
    // API CALL REQUIREMENTS
    if (!req.body.username){
      return res.status(400).json("username required to verify account email address");
    }
    if (!req.body.email){
      return res.status(400).json("email required to verify account email address");
    }
    if (!req.body.password){
      return res.status(400).json("password required to verify account email address");
    }
    if (!req.body.baseurl) {
      return res.status(400).json('req.body.baseurl is required to be either http://localhost:4000/ or https://www.abair.tcd.ie/anscealaibackend/'); 
    }

    logger.info('Beginning verification of ' + req.body.username);

    const user = await User.findOne({username: req.body.username})
      .catch(error => {
        return res.status(404).json({
          message: 'There was an error while trying to find a user with username: ' + req.body.username,
          error: error,
        });
      });

    if (user.status === 'Active'){
      if (user.email) {
        return res.status(400).json(`User: ${user.username} is already verified with the email address: ${user.email}. If you think this is a mistake please let us know at scealai.info@gmail.com`);
      }
      logger.warning(`User: ${user.usernam} was Active but had no assoctiated email address. Resetting to Pending`);
      let makePendingError, userMadePending = null;
      await User.findOneAndUpdate(
        // Find
        {username: user.username },
        // Update
        {status: 'Pending'},
        // Options
        {new:true})
        .catch( err => makePendingError = err)
        .then(res => userMadePending = res);
      if ( makePendingError ) {
        logger.error({endpoint: '/user/verifyOldAccount', error: makePendingError});
      }
      if ( !userMadePending ) {
        logger.error({endpoint: '/user/verifyOldAccount', message: 'There was an error while trying to set the users status to pending' });
        res
          .status(500)
          .json({
            file: './api/controllers/authentication.js',
            functionName: 'verifyOldAccount',
            message: 'There was an error on our server. We failed to update your status to Pending.',
          });
      }
    }


    const { error: mailError, success: mailRes } = sendVerificationEmail(req.body.username, req.body.password, req.body.email, req.body.baseurl);
    console.log('mailError', mailError);
    console.log('mailRes:', mailRes);
    if (mailError) {
      return res.status(500)
        .json({
          message: 'An error occurred while trying to send a verification email.',
          error: mailError,
        });
    }

    return res.status(200).json({message: 'User activation pending. Please check your email inbox'});

  } catch (error) {

    return res.status(500)
      .json({message: 'An unknown error occurred',
        file: '.api/controllers/authentication.js',
        functionName: 'verifyOldAccount',
        error: error,
      });
  }
}

module.exports.register = (req, res) => {

  if(!req.body.username || !req.body.password || !req.body.email) {
    sendJSONresponse(res, 400, {
      "message": "Username, password and email required."
    });
    return;
  }

  var user = new User();

  user.username = req.body.username;

  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.role = req.body.role;

  user.confirmationCode = jwt.sign({email: req.body.email},'sonJJxVqRC');

  user.save(async (err) => {
    //console.log(user._id);
    if(err) { 
      logger.error("Mongo error\nError code: ", err.code);
      if(err.code === 11000) {
        return res.status(400).json({
          "message": "Username taken, please choose another"
        });
      } 
    };
    
    if(!req.body.baseurl){
      logger.warning('Property basurl missing from registration request. Using default (dev server)');
      req.body.baseurl = 'http://localhost:4000';
    }
    const activationLink = `${req.body.baseurl}user/verify?username=${encodeURIComponent(req.body.username)}&email=${encodeURIComponent(req.body.email)}&confirmationCode=${encodeURIComponent(user.confirmationCode)}`;

    const mailObj = {
      from: 'scealai.info@gmail.com',
      recipients: [req.body.email],
      subject: 'Verify your account -- An Scéalaí',
      message: `Dear ${req.body.username},\n\
          Please click on the this <a href="${activationLink}">link</a> to activate your An Scéalaí account.\n\
          Activation link: ${activationLink}\n\
          Once your account has been activated you can return to the login page to log in.`,
    };
    
    let mailRes  = await mail.sendEmail(mailObj);

    console.log(mailRes);
    // Make sure the email wasn't rejected
    if (mailRes.rejected.length  !== 0){
      logger.error({
        message: 'Failed to send verification email while registering',
        user: req.body.username,
        email: req.body.email,
        mailObj: mailObj,
        mailRes: mailRes,
      });
      return sendJSONresponse(res, 400, {
        message: `Failed to send verification email to: ${req.body.email} ${JSON.stringify(mailRes)}`,
      });
    }

    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
};

module.exports.login = (req, res) => {
    
    if(!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({
          "message": "Username and password required"
        });
    }

    passport.authenticate('local', (err, user, info) => {

        if(err) {
            console.log(err)
            res.status(404).json(err);
            return;
        }

      if(user) {
        if(!user.status){
          throw new Error('User,',user,'has no status property');
        }
        if(user.status === 'Pending'){
          return res.status(300).json({ 
            userStatus: 'Pending',
            username: user.username,
            email: ( user.email ? user.email : null ) });
        } else if (user.status === 'Active') {
          const token = user.generateJwt();
          return res
            .status(200)
            .json({
              token: token
            });
        } else {
          throw new Error('User, ' + user.username + ' has an invalid status: ' + user.status + '. Should be Pending or Active.');
        }
      } else {
        res.status(400).json(info);
      }
    })(req, res);
};
