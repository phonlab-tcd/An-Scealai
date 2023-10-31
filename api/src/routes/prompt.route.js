const express = require("express");
const promptRoutes = express.Router();
import models from "../models/prompt";
const {
  GeneralPromptSchema,
  ProverbPromptSchema,
  ExamPromptSchema,
  LARAPromptSchema,
  CombinationPromptSchema,
  POSPromptSchema,
} = models;

/**
 * Set the collection to that specified in route params
 * @param {string} collectionName
 * @returns Mongoose collection
 */
function getCollection(collectionName) {
  let selectedCollection;
  switch (collectionName) {
    case "general":
      selectedCollection = GeneralPromptSchema;
      break;
    case "proverb":
      selectedCollection = ProverbPromptSchema;
      break;
    case "exam":
      selectedCollection = ExamPromptSchema;
      break;
    case "lara":
      selectedCollection = LARAPromptSchema;
      break;
    case "combination":
      selectedCollection = CombinationPromptSchema;
      break;
    case "partOfSpeech":
      selectedCollection = POSPromptSchema;
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
  if (!collection) return res.status(404).json(`Invalid collection name: ${req.params.type}`);

  const prompts = await collection.find();
  if (prompts) return res.status(200).json(prompts);

  return res.status(404).json(`No prompts found for ${req.params.type}`);
});

/**
 * Add prompt to the DB for specified prompt type
 * @param {Object} req
 * @return {Object} Newly created prompt
 */
promptRoutes.route("/addPrompt/:type").post(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json(`Invalid collection name: ${req.params.type}`);

  try {
    delete req.body.isSelected;
    delete req.body.isEdit;
    const existingPrompts = await collection.find(req.body);
    if (existingPrompts.length > 0) {
      return res.status(400).json(`Data already exists in the DB: ${existingPrompts}`);
    }
    const prompt = new collection({ ...req.body, lastUpdated: new Date() });

    prompt.save().then(() => {
        return res.json(prompt);
      }).catch((err) => {
        return res.status(400).json(`Unable to save to DB: ${err}`);
      });
  } catch (error) {
    return res.status(500).json(`Internal Server Error: ${error}`);
  }
});

/**
 * Update prompt with new values
 * @param {Object} req
 * @return {Object} Array of prompts
 */
promptRoutes.route("/updatePrompt/:type").patch(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json(`Invalid collection name: ${req.params.type}`);

  collection.findOneAndUpdate({ _id: req.body._id }, req.body).then((updatedDocument) => {
      return res.json(updatedDocument);
    }).catch((err) => {
      return res.status(400).json(`Unable to update prompt: ${err}`);
    });
});

/**
 * Delete prompt from the DB by id
 * @param {Object} req
 * @return {Object} Array of prompts
 */
promptRoutes.route("/deletePrompt/:type/:id").delete(async (req, res) => {
  const collection = getCollection(req.params.type);
  if (!collection) return res.status(404).json(`Invalid collection name: ${req.params.type}`);

  collection.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      return res.json(`Unable to delete prompt: ${err}`);
    } else {
      return res.json("Successfully removed prompt from the DB");
    }
  });
});

module.exports = promptRoutes;
