const { ObjectId } = require("bson");
const express = require("express");
const promptRoutes = express.Router();

const Prompt = require("../models/prompt");

/**
 * Get all prompts from the DB
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes.route("/get").get(async (req, res) => {
  const prompts = await Prompt.find();
  if (prompts) return res.status(200).json(prompts);

  return res.status(404).json({ message: "No prompts found" });
});

/**
 * Get prompts from the DB by type
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes.route("/getByType/:type").get(async (req, res) => {
  const prompts = await Prompt.find({ type: req.params.type });

  if (prompts) return res.status(200).json(prompts);

  return res
    .status(404)
    .json({ message: `No ${req.params.type} prompts found` });
});

/**
 * Get prompts from the DB by type and dialect
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes.route("/getByTypeAndDialect/:type/:dialect").get(async (req, res) => {
    const prompts = await Prompt.find({
      type: req.params.type,
      dialect: req.params.dialect,
    });
   
    if (prompts) return res.status(200).json(prompts);

    return res
      .status(404)
      .json({
        message: `No ${req.params.type} prompts for ${req.params.dialect} found`,
      });
  });

/**
 * Get prompts from the DB by type and level
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes.route("/getByTypeAndLevel/:type/:level").get(async (req, res) => {
  const prompts = await Prompt.find({ type: req.params.type, level: req.params.level });

  if (prompts) {
    const promptSentences = prompts.map(item => item.prompt)
    return res.status(200).json(promptSentences);
  } 

  return res
    .status(404)
    .json({
      message: `No ${req.params.type} prompts for ${req.params.level} found`,
    });
});

/**
 * Get POS from the DB by type and part of speech
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
promptRoutes
  .route("/getByPartOfSpeech/:type/:partOfSpeech")
  .get(async (req, res) => {
    const prompts = await Prompt.find({
      type: req.params.type,
      level: req.params.partOfSpeech,
    });
    if (prompts) return res.status(200).json(prompts);

    return res
      .status(404)
      .json({
        message: `No ${req.params.type} prompts for ${req.params.partOfSpeech} found`,
      });
  });

module.exports = promptRoutes;
