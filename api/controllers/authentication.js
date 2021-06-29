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
    .catch(err => {});

  console.log("user:",user);


  res.status(200).send('<h1>Sorry</h1><p>That didn\'t work.</p>');
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

module.exports.login = function(req, res) {
    
    if(!req.body.username || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "Username and password required"
        });
        return;
    }
    
    passport.authenticate('local', function(err, user, info) {
        var token;

        if(err) {
            console.log(err)
            res.status(404).json(err);
            return;
        }

        if(user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            res.status(400).json(info);
        }
    })(req, res);
};
