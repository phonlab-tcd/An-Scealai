const User = require('../../models/user');

/**
* Returns the total number of users on the DB as well as individual
* counts of each user role
* @param {Object} req
* @param {Object} res
* @return {Object} Dictionary of role types and total counts
*/
async function getUserCount(req, res) {
  const total = await User.where({}).countDocuments();
  const student = await User.where({role: 'STUDENT'}).countDocuments();
  const teacher = await User.where({role: 'TEACHER'}).countDocuments();
  const admin = await User.where({role: 'ADMIN'}).countDocuments();
  return res.status(200).json({
    total: total,
    student: student,
    teacher: teacher,
    admin: admin,
  });
}

module.exports = getUserCount;
