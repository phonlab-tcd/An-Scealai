var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.viewUser = function(req, res) {
  if(!req.headers._id) {
    res.status(404).json({"message" : "User not found"});
  } else {
    User.findById(req.headers._id).exec(function(err, user) {
      if(err) {
        res.status(400).json({"message" : "User not found"});
      }
      if(user) {
        res.status(200).json(user);
      }
    });
  }
};

module.exports.getTeachers = function(req, res) {
  User.find({'role':'TEACHER'}).exec(function(err, teachers) {
    if(err) {
      res.status(400).json({"message" : "Teachers not found"});
    }
    if(teachers) {
      res.status(200).json(teachers);
    }
  });
};
