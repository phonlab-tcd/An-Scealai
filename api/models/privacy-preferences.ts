const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Consent = new Schema({
  option: {type: String, enum: ["accept","reject"]},
  prose: String,
},{_id: false, timestamps: true});

const defaultTo = (option: "accept"|"reject") => 
  ({default: {option,prose: undefined}, type: Consent});

const PrivacyPreferences = new Schema({
  owner: { type: ObjectId, ref: "User" },
  "Cloud Storage":        defaultTo("accept"),
  "Google Analytics":     defaultTo("reject"),
  "Engagement":           defaultTo("reject"),
  "Linguistics Research": defaultTo("reject"),
}, {
  collection: "privacyPreferences",
  timestamps: true,
});

export = mongoose.model("PrivacyPreferences", PrivacyPreferences);
