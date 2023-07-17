const express = require('express');
const teacherCodeRoutes = express.Router();
const TeacherCode = require('../models/teacherCode');

/**
 * Create a new teacher code
 * @param {Object} req body: code information
 * @return {Object} Success or error message
 */
teacherCodeRoutes.route('/create').post(function(req, res) {
  const teacherCode = new TeacherCode(req.body);
  teacherCode.save().then((teacherCode) => {
    res.status(200).json({'teacherCode': 'teacherCode added successfully'});
  })
      .catch((err) => {
        res.status(400).send('Unable to save to DB' + err);
      });
});

/**
 * Get all teacher codes from the DB
 * @return {Object} List of codes
 */
teacherCodeRoutes.route('/activeCodes').get(function(req, res) {
  TeacherCode.find(function(err, teacherCodes) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json(teacherCodes);
    }
  });
});

/**
 * Check if code is active
 * @param {Object} req params: code
 * @return {Object} Success or error message
 */
teacherCodeRoutes.route('/isActiveCode/:code').get(function(req, res) {
  TeacherCode.findOne({'code': req.params.code}, function(err, code) {
    if (err || code === null) {
      res.status(400);
      res.json({'message': 'Invalid activation code'});
    } else {
      res.status(200);
      res.json('Teacher code is active.');
    }
  });
});

/**
 * Delete teacher code
 * @param {Object} req params: code
 * @return {Object} Success or error message
 */
teacherCodeRoutes.route('/delete/:code').get(function(req, res) {
  TeacherCode.findOneAndRemove({'code': req.params.code}, function(err, code) {
    if (err || code === null) {
      res.status(400);
      res.json({'message': 'Error activating account'});
    } else {
      res.status(200);
      res.json('Successfully deleted activation code ' + req.params.code);
    }
  });
});

module.exports = teacherCodeRoutes;
