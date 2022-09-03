const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Consent = new Schema({
  option: {type: String, enum: ["accept","reject"]},
  prose: String,
},{_id: false})

const PrivacyPreferences = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  'Google Analytics': Consent,
  'Engagement': Consent,
  'Cloud Storage': Consent,
}, {
  collection: "privacyPreferences"
});

export = mongoose.model('PrivacyPreferences', PrivacyPreferences);
