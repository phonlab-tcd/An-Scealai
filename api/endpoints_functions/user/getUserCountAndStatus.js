const User = require('../../models/user');

/**
* Returns the total number of users on the DB for each roll as well as
* numbers for active and pending accounts
* @param {Object} req
* @param {Object} res
* @return {Promise} Dictionary of role types, account status, and total counts
*/
async function getUserCountAndStatus(req, res) {
  const totalStudents = await User.where({role: 'STUDENT'}).countDocuments();
  const activeStudents = await User.where({role: 'STUDENT', status: 'Active'}).countDocuments();
  const pendingStudents = await User.where({role: 'STUDENT', status: 'Pending'}).countDocuments();
  const totalTeachers = await User.where({role: 'TEACHER'}).countDocuments();
  const activeTeachers = await User.where({role: 'TEACHER', status: 'Active'}).countDocuments();
  const pendingTeachers = await User.where({role: 'TEACHER', status: 'Pending'}).countDocuments();
  const admin = await User.where({role: 'ADMIN'}).countDocuments();
  // don't include count for admin and users created for load testing for total
  const total = (await User.where({}).countDocuments()) - admin;
  return res.status(200).json({
    total: total,
    activeStudents: activeStudents,
    pendingStudents: pendingStudents,
    totalStudents: totalStudents,
    activeTeachers: activeTeachers,
    pendingTeachers: pendingTeachers,
    totalTeachers: totalTeachers,
    admin: admin,
  });
}

module.exports = getUserCountAndStatus;
