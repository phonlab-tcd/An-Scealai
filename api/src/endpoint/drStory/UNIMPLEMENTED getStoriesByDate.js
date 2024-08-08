const Story = require("../../models/story");
const mongoose = require("mongoose");
const { API404Error } = require("../../utils/APIError");

/**
 * Get given student's stories written whithen the given date range
 * @param {Object} req The student's id number
 * @param {Object} res The object to store the response
 * @return {Promise} Student's stories within date range
 */
module.exports = async (req, res) => {
  let ownerId = null;

  try {
    ownerId = new mongoose.mongo.ObjectId(req.params.studentId);
  } catch (error) {
    return res.status(404).json(`id ${req.params.studentId} is not a valid ObjectId`);
  }

  const conditions = { owner: ownerId };
  if (req.body.startDate !== "" && req.body.endDate !== "") {
    conditions["updatedAt"] = {
      $gte: req.body.startDate,
      $lte: req.body.endDate,
    };
  }

  const stories = await Story.find(conditions);

  if (!stories) {
    throw new API404Error(`No stories written by user with 
      id ${ownerId} were found.`);
  }

  if (stories.length > 0) {
    res.status(200).json(stories);
  } else {
    res.status(200).json([]);
  }
};
