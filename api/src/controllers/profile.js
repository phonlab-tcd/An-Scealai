var mongoose = require('mongoose');
var User = mongoose.model('User');

const either=promise=>promise.then(ok=>({ok}),err=({err}));

module.exports.viewUser = async function(req, res) {
  if(!req.headers._id) return res.status(404).json({message: "User not found"});
  const user = await either(User.findById(req.headers._id));
  if(user.err) return res.status(400).json(user.err);
  if(!user.ok) return res.status(404).json();
  res.json(user.ok);
};

module.exports.getTeachers = async function(req, res) {
  const role = 'TEACHER';
  const teachers = await either(User.find({role}));
  if(teachers.err) return res.status(400).json({message : "Teachers not found"});
  if(!teachers.ok) return res.status(404).json();
  return res.json(teachers.ok);
};
