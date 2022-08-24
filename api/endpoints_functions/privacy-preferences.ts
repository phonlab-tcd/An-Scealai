import type { RequestHandler } from "express";

export const get: RequestHandler = function (req,res,next){
  const doc = PrivacyPreferences
    .updateOne({owner: req.user._id},{},{upsert: true})
    .then(ok=>({ok}),err=>({err}));
  if(doc.err) return res.status(400).json(doc.err);
  return res.json(doc.ok);
}