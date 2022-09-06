import type { RequestHandler } from "express";
const PrivacyPreferences = require("../models/privacy-preferences");

export const post: RequestHandler = async function (req,res,next) {
  if(typeof req.body.prose !== "string") return res.status(400).json("field `prose` must be a string");
  const $set = {};
  $set[req.body.forGroup] = {option: req.body.option, prose: req.body.prose};

  const doc = await PrivacyPreferences
    .findOneAndUpdate(
      {owner: req.user._id},
      {$set},
      {upsert: true, new: true})
    .then(ok=>({ok}),err=>({err}));
  console.log(doc);
  if(doc.err) return res.status(400).json(doc.err);
  return res.json(doc.ok);
}

export const get: RequestHandler = async function (req,res,next) {
  const $set = {};
  $set[req.body.forGroup] = {option: req.body.option, prose: req.body.prose};

  const doc = await PrivacyPreferences
    .findOne({owner: req.user._id})
    .then(ok=>({ok}),err=>({err}));
  console.log(doc);
  if(doc.err) return res.status(400).json(doc.err);
  return res.json(doc.ok);
}