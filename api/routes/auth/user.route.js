const userRoutes = new require('express').Router();
const auth = require('../../utils/jwtAuthMw');
const ctrlProfile = require('../../controllers/profile');
const logger = require('../../logger');

function getUserByUsername(req, res) {
  User.find({username: req.params.username}, (err, user) => {
    if(err) {
      logger.warning(err);
      return res.send(err);
    }
    if(user) {
      user.email = 401;
      return res.json(user);
    }
    return res.status(404).json("User not found");
  });
}

function setLanguage(req, res, next) {
  req.user.language = req.body.language;
  req.user.save()
    .then(res.json)
    .catch(next)
}

function deleteUserByUsername(req, res) {
  User.findOneAndRemove({"username": req.params.username})
    .then(res.json)
    .catch(next);
}

function needValidUsername(req, res, next) {
  if (!req.body.username) {
    return next(new Error('req.body.username is required'));
  }
  const validUsernameRegEx = /^[a-z0-9]+$/i;
  if (!req.body.username.match(validUsernameRegEx) ) {
    return res.status(400).send(
        `${req.body.username} is an invalid username. ` +
        `Valid characters are: a-z, A-Z, 0-9`);
  }
  next();
}

function updateUsername (req, res) {
  User.findByIdAndUpdate(req.user._id, {username: req.body.username })
    .then(res.json)
    .catch(next);
}

function updatePassword(req, res) {
  req.user.setPassword(req.body.password);
  req.user.save()
    .then(res.json)
    .catch(next);
}

userRoutes.use(auth)
userRoutes.get('/profile', auth, ctrlProfile.profileRead);
userRoutes.post('/setLanguage/:id', setLanguage);
// TODO: breaking change!! does this break the frontend? (neimhin 02-05-2022)
// this route now requires authentication
userRoutes.get('/getUserByUsername/:username', getUserByUsername);
// TODO: breaking change!! /user/deleteUser is now a DELETE request
// Delete user by username
userRoutes.delete('/:username', deleteUserByUsername);

// Update username of authenticated requester
userRoutes.patch('/username',
  needValidUsername,
  updateUsername);

// Update password of authenticated requester
userRoutes.patch('/updatePassword', updatePassword);

// Update account with random password, send user an email
userRoutes.route('/sendNewPassword/').post((req, res) => {
    User.findOne({"username": req.body.username}, (err, user) => {
        if(err){
          return res.status(500).json(err);
        }
        if(user) {
            var randomPassword = generator.generate({
              length: 10,
              numbers: true
            });
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = crypto.pbkdf2Sync(randomPassword, user.salt, 1000, 64, 'sha512').toString('hex');
            console.log("change password to: ", randomPassword);
            user.save().then(() => {

              //console.log("Constructing the mailObj");
              const mailObj = {
                from: "scealai.info@gmail.com",
                recipients: [req.body.email],
                subject: 'Update Password -- An Scéalaí',
                message: `Hello ${req.body.username},\nYour An Scéalaí password has been updated to:\n${randomPassword}`, // TODO ask the user to change their password again
              };

              mail.sendEmail(mailObj).then( (nodemailerRes) => {
                logger.info(nodemailerRes);
                res.status(200).json("Password updated successfully");
              }).catch( err => {
                logger.error(err);
                res.status(500);
              });
             }).catch(err => {
                res.status(500).json(err);
            })
        } else {
            res.status(404).json(`User with _id ${req.params.id} could not be found`);
        }
    });
});

module.exports = userRoutes;
