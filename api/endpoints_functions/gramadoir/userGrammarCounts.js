const mongoose = require('mongoose');
const UserGrammarCounts = require('../../models/userGrammarCounts');
const {API500Error} = require('../../utils/APIError');


// Get set of new errors from frontend client (frontend has to determine which errors are new and which are old).
// Create a new document with the counts of these errors by type (e.g. GENITIVE, BACHOIR, NISEIMHIU, etc.).
// To get the total counts of errors for a user, would have to scan the collection by the owner and collate documents,
// which is delegated to another part of the code base for simplicity/efficiency. (neimhin Mon 16 Jan 2023 17:59:40 GMT)
module.exports = async function (req, res, next) {
  const userId = new mongoose.mongo.ObjectId(req.user._id);

  const { ok, err } = await createDoc(userId, req.body.countsByType);

  // would be better to just handle this error here
  // rather than throwing (neimhin Mon 16 Jan 2023 17:59:14 GMT)
  if (!ok) throw new API500Error('Unable to save error counts to DB.');

  res.status(200).json({});

  // owner: ObjectId, errorCounts: {[ErrorType]: number}
  function createDoc(owner, errorCounts) {
    return UserGrammarCounts.create({owner,errorCounts})
	.then(asOk,asErr);

    function asOk(ok)   { return { ok  } }
    function asErr(err) { return { err } }
  }
};
