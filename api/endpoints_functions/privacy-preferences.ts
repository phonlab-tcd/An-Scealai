import type { RequestHandler } from "express";
const PrivacyPreferences = require("../models/privacy-preferences");

const PrivacyPreferencesProse = require('mongoose')
.model('PrivacyPreferencesProse',
  new (require('mongoose').Schema)({
    prose: String,
    for: String,
}));

export const post: RequestHandler = async function (req,res,next) {
  const $set = {};
  const prose = await PrivacyPreferencesProse.findOneAndUpdate({prose: req.body.prose, for: req.body.forGroup},{},{upsert: true, new: true});
  $set[req.body.forGroup] = {option: req.body.option};
  $set['proseId'] = prose._id;
  console.log({$set});

  const doc = await PrivacyPreferences
    .findOneAndUpdate(
      {owner: req.user._id},
      {$set},
      {upsert: true, new: true})
    .then(ok=>({ok}),err=>({err}));
  console.log(doc);
  console.log(prose);
  if(doc.err) return res.status(400).json(doc.err);
  return res.json(doc.ok);
}