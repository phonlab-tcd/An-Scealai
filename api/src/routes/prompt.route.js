const express = require("express");
const promptRoutes = express.Router();
import models from '../models/prompt';
const { GeneralPromptSchema, ProverbPromptSchema, ExamPromptSchema, LARAPromptSchema, CombinationPromptSchema, POSPromptSchema, Prompt } = models;

function getCollection(collectionName) {
  let selectedCollection;
  switch (collectionName) {
    case 'general':
      selectedCollection = GeneralPromptSchema;
      break;
    case 'proverb':
      selectedCollection = ProverbPromptSchema;
      break;
    case 'exam':
      selectedCollection = ExamPromptSchema;
      break;
    case 'lara':
      selectedCollection = LARAPromptSchema;
      break;
    case 'combination':
      selectedCollection = CombinationPromptSchema;
      break;
    case 'partOfSpeech':
      selectedCollection = POSPromptSchema;
      break;
    case 'prompt':
      selectedCollection = Prompt;
      break;
    default:
      return null;
  }

  return selectedCollection;
}

/**
 * Get prompts from the DB by type (i.e. general, proverb, etc.)
 * @param {Object} req
 * @return {Object} Array of prompts
 */
promptRoutes.route("/getPrompts/:type").get(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json({ message: "Invalid collection name" });

  const prompts = await collection.find();
  if (prompts) return res.status(200).json(prompts);

  return res.status(404).json({ message: "No prompts found" });
});

/**
 * Get prompts from the DB by type (i.e. general, proverb, etc.)
 * @param {Object} req
 * @return {Object} Array of prompts
 */
promptRoutes.route("/addPrompt/:type").post(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json({ message: "Invalid collection name" });
  console.log(req.body);

  const prompt = new collection({...req.body});

  prompt.save()
  .then(() => {
    return res.json(prompt);
  })
  .catch((err) => {
    console.log(err);
    return res.status(400).send("unable to save to DB");
  });

});

/**
 * Get prompts from the DB by type (i.e. general, proverb, etc.)
 * @param {Object} req
 * @return {Object} Array of prompts
 */
promptRoutes.route("/updatePrompt/:type").patch(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json({ message: "Invalid collection name" });

  collection.findOneAndUpdate(
    { _id: req.body._id },
    req.body
  ).then((updatedDocument) => {
    return res.json(updatedDocument);
  })
  .catch((err) => {
    console.log(err);
    return res.status(400).send("unable to update prompt");
  });
});

/**
 * Get prompts from the DB by type (i.e. general, proverb, etc.)
 * @param {Object} req
 * @return {Object} Array of prompts
 */
promptRoutes.route("/deletePrompt/:type/:id").delete(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json({ message: "Invalid collection name" });

  collection.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json('Successfully removed prompt from the DB');
    }
  });
});



// /**
//  * Add new prompt entry if it doesn't already exist
//  * @param {Object} req body: Message object
//  * @return {Object} Success or error message
//  */
// promptRoutes.route("/addContent").post(async function (req, res) {
//   const selectedCollection = getCollection("general");
  
//   const existingPrompts = await Prompt.find(req.body); 
//   if (existingPrompts.length > 0) {
//     console.log("Prompt already exists")
//     return res.status(400).json({msg: "data already exists in the DB", data: existingPrompts});
//   }

//   const prompt = new Prompt({...req.body, lastUpdated: new Date()});
//   console.log("PROMPT: ", prompt);

//   prompt.save()
//   .then(() => {
//     return res.json(prompt);
//   })
//   .catch((err) => {
//     console.log(err);
//     return res.status(400).send("unable to save to DB");
//   });
// });

// /**
//  * Get prompts from the DB by type (i.e. partOfSpeech, prompt)
//  * @param {Object} req
//  * @return {Object} Total number of profiles
//  */
// promptRoutes.route("/getData/:type").get(async (req, res) => {
//   const prompts = await Prompt.find({type: req.params.type});
//   if (prompts) return res.status(200).json(prompts);

//   return res.status(404).json({ message: "No prompts found" });
// });

// /**
//  * Get prompt data by topic (i.e. general, exam, etc.)
//  * @param {Object} req
//  * @return {Object} Total number of profiles
//  */
// promptRoutes.route("/getPromptDataByTopic/:topic").get(async (req, res) => {
//   console.log("getting prompt data: ", req.params.topic)
//   const prompts = await Prompt.find({type: "prompt", "prompt.topic": req.params.topic });
//   if (prompts) {
//     return res.status(200).json(prompts);
//   };

//   return res.status(404).json({ message: "No prompts found" });
// });

module.exports = promptRoutes;
