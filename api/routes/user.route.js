// endpoint prefix = '/user'
const logger = require('../logger');
const generator = require('generate-password');
const makeEndpoints = require('../utils/makeEndpoints');
const passport = require('passport');
const checkJwt = require('../utils/jwtAuthMw');
const mail = require('../mail');
const crypto = require('node:crypto');
const User = require('../models/user');
const ctrlProfile = require('../controllers/profile');
const ctrlAuth = require('../controllers/authentication');

let userRoutes;
// Immediately Invoked Function Expression.
// Scopes the imported functions to just this function
(() => {
  // ENDPOINT HANDLERS
  const searchUser =
    require('../endpoints_functions/user/searchUser');
  const getUserCount =
    require('../endpoints_functions/user/getUserCount');
  const getUserCountAndStatus =
    require('../endpoints_functions/user/getUserCountAndStatus');
  const updateUsername =
    require('../endpoints_functions/user/updateUsername');
  const countUsersWithStories =
    require('../endpoints_functions/user/countUsersWithStories');
  const countTeachersWithClassrooms =
    require('../endpoints_functions/user/countTeachersWithClassrooms');
  const getLanguageCount =
    require('../endpoints_functions/user/getLanguageCount');

  userRoutes = makeEndpoints({
    get: {
      '/count': getUserCount,
      '/countAndStatus': getUserCountAndStatus,
      '/countUsersWithStories': countUsersWithStories,
      '/countTeachersWithClassrooms': countTeachersWithClassrooms,
      '/getLanguageCount': getLanguageCount,
    },
    post: {
      '/searchUser': searchUser,
      '/updateUsername/:id': updateUsername,
    },
  });
})();

userRoutes.post('/register', ctrlAuth.register);
userRoutes.post('/login', passport.authenticate('local'), ctrlAuth.login);
userRoutes.post('/verifyOldAccount', ctrlAuth.verifyOldAccount);
userRoutes.post('/resetPassword', ctrlAuth.resetPassword);

userRoutes.get('/generateNewPassword', ctrlAuth.generateNewPassword);
userRoutes.get('/verify', ctrlAuth.verify);
userRoutes.get('/viewUser', checkJwt, ctrlProfile.viewUser);
userRoutes.get('/teachers', checkJwt, ctrlProfile.getTeachers);

/**
 * Set user language preference
 * @param {Object} req params: User ID
 * @return {Object} Success or error message
 */
userRoutes.route('/setLanguage/:id').post(checkJwt, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (user) {
      user.language = req.body.language;
      user.save().then(() => {
        res.status(200).json('Language set successfully');
      }).catch((err) => {
        logger.error(err.stack || err);
        res.status(400).send(err);
      });
    }
  });
});

/**
 * Get user language preference
 * @param {Object} req params: User ID
 * @return {Object} language code
 */
userRoutes.route('/getLanguage/:id').get(checkJwt, (req, res) => {
  User.findById(req.user._id)
      .then(
          (user) => user ? res.json({language: user.language}) : res.status(404).json('User not found'),
          (err) => {
            console.error(err); res.status(400).json(err);
          },
      );
});

/**
 * Get user by username
 * @param {Object} req params: User's username
 * @return {Object} User
 */
userRoutes.route('/getUserByUsername/:username').get(checkJwt, (req, res) => {
  User.find({'username': req.params.username}, (err, user) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (user) {
      res.json(user);
    } else {
      res.status(404).json('User not found');
    }
  });
});

/**
 * Delete user by ID
 * @param {Object} req params: User ID
 * @return {Object} Success or error message
 */
userRoutes.route('/deleteUser/:id').get(function(req, res) {
  User.findOneAndRemove({_id: req.params.id}, function(err, user) {
    if (err) {
      console.log(err);
      res.send(err);
    } else res.json('Successfully removed user');
  });
});


/**
 * Update user password -- DEPRICATED?
 * @param {Object} req params: Student ID
 * @return {Object} Success or error message
 */
userRoutes.route('/updatePassword/:id').post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (user) {
      user.salt = crypto.randomBytes(16).toString('hex');
      user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
      user.save().then(() => {
        res.status(200).json('Password updated successfully');
      }).catch((err) => {
        res.status(500).send(err);
      });
    } else {
      res.status(404).send(`User with _id ${req.params.id} could not be found`);
    }
  });
});

/**
 * Send user an email with randomly generated password and update user object => DEPRICATED?
 * @param {Object} req body: Classroom object
 * @return {Object} Success or error message
 */
userRoutes.route('/sendNewPassword/').post((req, res) => {
  User.findOne({'username': req.body.username}, (err, user) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (user) {
      const randomPassword = generator.generate({
        length: 10,
        numbers: true,
      });
      user.salt = crypto.randomBytes(16).toString('hex');
      user.hash = crypto.pbkdf2Sync(randomPassword, user.salt, 1000, 64, 'sha512').toString('hex');
      console.log('change password to: ', randomPassword);
      user.save().then(() => {
        const mailObj = {
          from: 'scealai.info@gmail.com',
          recipients: [req.body.email],
          subject: 'Update Password -- An Scéalaí',
          message: `Hello ${req.body.username},\nYour An Scéalaí password has been updated to:\n${randomPassword}`, // TODO ask the user to change their password again
        };

        mail.sendEmail(mailObj).then( (nodemailerRes) => {
          logger.info(nodemailerRes);
          res.status(200).json('Password updated successfully');
        }).catch( (err) => {
          logger.error(err);
          res.status(500);
        });
      }).catch((err) => {
        res.status(500).json(err);
      });
    } else {
      res.status(404).json(`User with _id ${req.params.id} could not be found`);
    }
  });
});

module.exports = userRoutes;
