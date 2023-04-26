const express = require("express");
const promptRoutes = express.Router();
const Prompt = require("../models/prompt");

/**
 * Add new prompt entry if it doesn't already exist
 * @param {Object} req body: Message object
 * @return {Object} Success or error message
 */
promptRoutes.route("/addContent").post(async function (req, res) {
  const existingPrompts = await Prompt.find(req.body); 
  if (existingPrompts.length > 0) {
    console.log("Prompt already exists")
    return res.status(400).json("data already exists in the DB");
  }

  const prompt = new Prompt({...req.body, lastUpdated: new Date()});
  console.log("PROMPT: ", prompt);

  prompt.save()
  .then((message) => {
    return res.json(message);
  })
  .catch((err) => {
    console.log(err);
    return res.status(400).send("unable to save to DB");
  });
});

/**
 * Get prompts from the DB by type (i.e. partOfSpeech, prompt)
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes.route("/getData/:type").get(async (req, res) => {
  const prompts = await Prompt.find({type: req.params.type});
  if (prompts) return res.status(200).json(prompts);

  return res.status(404).json({ message: "No prompts found" });
});

/**
 * Get prompt data by topic (i.e. general, exam, etc.)
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes.route("/getPromptDataByTopic/:topic").get(async (req, res) => {
  console.log("getting prompt data: ", req.params.topic)
  const prompts = await Prompt.find({type: "prompt", "prompt.topic": req.params.topic });
  if (prompts) {
    return res.status(200).json(prompts);
  };

  return res.status(404).json({ message: "No prompts found" });
});

module.exports = promptRoutes;
