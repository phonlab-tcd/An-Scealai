import type { RequestHandler } from "express"
const PrivacyPreferences = require("../../models/privacy-preferences");
const { GoogleAnalyticsConsentPrompt } = require("../../google-analytics-prompt");

const promptVersions = Object.keys(GoogleAnalyticsConsentPrompt);
const validPrompt=(p)=>(promptVersions.indexOf(p) >= 0);
const validAccept=(a)=>(typeof a === "boolean");
export const patch: RequestHandler = async function(req,res,next) {
  const bad = (msg,status=400) => res.status(status).json(msg);
  if(!validPrompt(req.body.prompt)) return bad("field `prompt` should be one of " + promptVersions);
  if(!validAccept(req.body.accept)) return bad("field `accepted` should be a boolean");

  const doc = await PrivacyPreferences.updateOne({
    owner: req.user._id,
    googleAnalytics: {
      prompt: req.body.prompt || undefined,
      accepted: req.body.accepted || undefined,
    },
  },{upsert: true}).then(ok=>({ok}),err=>({err}));
  if(doc.err) return res.status(400).json(err.message);
  return res.json(doc.ok);
};
