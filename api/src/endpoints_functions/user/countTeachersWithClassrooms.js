const User = require('../../models/user');
const Classroom = require('../../models/classroom');

/**
* Returns the number of teachers who have at least one classroom
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of teachers who have at least one classroom
*/
async function countTeachersWithClassrooms(req, res) {
  const userIds = await User.find({'role': 'TEACHER'}, {'_id': 1});
  const ids = userIds.map( (item) => {return item._id});

  let teachersWithClassrooms = 0;

  // count the number of users that have not written any stories
  for (const id of ids) {
    const numOfClassrooms = await Classroom.find({'teacherId': id}).countDocuments();

    if (numOfClassrooms > 0) {
      teachersWithClassrooms++;
    }
  }

  return res.status(200).json(teachersWithClassrooms);
}

module.exports = countTeachersWithClassrooms;
