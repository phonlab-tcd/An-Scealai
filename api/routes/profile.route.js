const {ObjectId} = require('bson');
const express = require('express');
const profileRoutes = express.Router();

const Profile = require('../models/profile');

/**
 * Create a new profile
 * @param {Object} req body: User ID and profile object
 * @param {Object} req user: User object
 * @return {Object} Success or error message
 */
profileRoutes.route('/create').post((req, res) => {
  req.body.owner = new ObjectId(req.user._id);
  Profile.updateOne({userId: req.user._id}, req.body, {upsert: true})
      .then( (upsertDetails)=>res.status(200).send(upsertDetails),
          (err) =>res.status(400).send(err));
});

/**
 * Get total number of profiles
 * @param {Object} req
 * @return {Object} Total number of profiles
 */
profileRoutes.route('/getCount').get(async (req, res) => {
  const profileCount = await Profile.find().countDocuments();
  res.status(200).json(profileCount);
});

/**
 * Get a profile by ID
 * @param {Object} req params: Profile ID
 * @return {Object} Profile object
 */
profileRoutes.route('/get/:id').get((req, res) => {
  Profile.findById(req.params.id, (err, profile) => {
    if (err) {
      console.log(err);
      res.status(400).send('An error occurred while trying to find this profile');
    } else {
      if (profile) {
        res.status(200).json({'profile': profile});
      } else {
        res.status(404).send('Profile with given ID not found');
      }
    }
  });
});

/**
 * Get the profile for a given user
 * @param {Object} req user: User ID
 * @return {Object} Profile object
 */
profileRoutes.route('/getForUser/:id').get((req, res) => {
  Profile.findOne({'userId': req.user._id})
      .then(
          (profile) => res.status(profile ? 200 : 404).json({profile}),
          (err) => res.status(400).send('An error occurred while trying to find this profile'),
      );
});

/**
 * Delete the profile of a given user
 * @param {Object} req user: User ID
 * @return {Object} Success or error message
 */
profileRoutes.route('/deleteProfile/:id').get(function(req, res) {
  Profile.findOneAndRemove({'userId': req.user._id}, function(err, profile) {
    if (err) {
      res.json(err);
    } else res.json('Successfully removed profile');
  });
});

/**
 * Get counts of counties for all users
 * @param {Object} req
 * @return {Object} Total number of counties
 */
profileRoutes.route('/getCountyCounts').get(async (req, res) => {
  const profiles = await Profile.find();
  const countyTotals = {};

  // create a dictionary of county name and total counts
  for (const entry of profiles) {
    if (entry.county) {
      let county = entry.county;
      if (entry.county == 'Baile Átha Cliath') county = 'Contae Átha Cliath'; // can only use one 'Dublin' for map on admin dashboard
      if (!countyTotals[county]) countyTotals[county] = 0;
      countyTotals[county] += 1;
    }
  }

  res.status(200).json(countyTotals);
});


module.exports = profileRoutes;
