const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const { EventEnum } = require('./event');
const { GoogleAnalyticsConsentPrompt } = require('../google-analytics-prompt');

const GoogleAnalytics = new Schema({
  prompt: {type: String, enum: Object.keys(GoogleAnalyticsConsentPrompt)},
  accepted: Boolean,
},{_id:false});

const Engagement = new Schema({
  acceptedEventTypes: [EventEnum],
},{_id:false});

const PrivacyPreferences = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  googleAnalytics: GoogleAnalytics,
  engagement: Engagement,
}, {
  collection: "privacyPreferences"
});

export = mongoose.model('PrivacyPreferences', PrivacyPreferences);
