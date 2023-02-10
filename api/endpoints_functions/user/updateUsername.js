const User = require('../../models/user');
const {API404Error} = require('../../utils/APIError');

/**
 * Update username
 * @param {Object} req Includes user id and new username
 * @param {Object} res Returns response success code
 */
async function updateUsername(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new API404Error(`No users with this id were found.`);
  }

  user.username = req.body.newUsername;
  try {
    await user.save();
    return res.status(200).json('Username updated successfully');
  } catch (err) {
    return res.status(500).send(err);
  }
}

module.exports = updateUsername;
