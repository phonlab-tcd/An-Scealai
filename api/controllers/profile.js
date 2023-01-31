const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * Get user from the DB by ID
 * @param {Object} req headers: user ID
 * @param {Object} res User object
 */
module.exports.viewUser = function(req, res) {
  if (!req.headers._id) {
    res.status(404).json({'message': 'User not found'});
  } else {
    User.findById(req.headers._id).exec(function(err, user) {
      if (err) {
        res.status(400).json({'message': 'User not found'});
      }
      if (user) {
        res.status(200).json(user);
      }
    });
  }
};

/**
 * Get all teacher users from the DB
 * @param {Object} req headers: user ID
 * @param {Object} res List of teachers
 */
module.exports.getTeachers = function(req, res) {
  User.find({'role': 'TEACHER'}).exec(function(err, teachers) {
    if (err) {
      res.status(400).json({'message': 'Teachers not found'});
    }
    if (teachers) {
      res.status(200).json(teachers);
    }
  });
};
