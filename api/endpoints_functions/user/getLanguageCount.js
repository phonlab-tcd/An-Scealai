const User = require('../../models/user');

/**
* Count the number of uses with English and Irish langauge settings
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of English and Irish users
*/
async function getLanguageCount(req, res) {
  const englishCount = await User.find({'language': 'en'}).countDocuments();
  const irishCount = await User.find({'language': 'ga'}).countDocuments();

  return res.status(200).json({
    englishCount: englishCount,
    irishCount: irishCount,
  });
}

module.exports = getLanguageCount;
