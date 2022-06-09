const {describe,it} = require('../utils/inline-tests')();
const express = require('express');
const app = express();
const teacherCodeRoutes = express.Router();

let TeacherCode = require('../models/teacherCode');

teacherCodeRoutes.route('/create').post(function (req, res) {
    let teacherCode = new TeacherCode(req.body);
    teacherCode.save().then(teacherCode => {
        res.status(200).json({'teacherCode': 'teacherCode added successfully'});
    })
    .catch(err => {
        res.status(400).send("Unable to save to DB" + err);
    });
});

teacherCodeRoutes.route('/activeCodes').get(function (req, res) {
    TeacherCode.find(function(err, teacherCodes) {
    if(err) {
        console.log(err);
        res.json(err);
    } else {
        res.json(teacherCodes);
    }
    });
});

teacherCodeRoutes.route('/isActiveCode/:code').get(function (req, res) {
    console.log("req code", req.params.code);
    TeacherCode.findOne({"code":req.params.code}, function(err, code) {
        console.log("err", err, "code", code);
        if(err || code === null) {
            res.status(400);
            res.json({"message" : "Invalid activation code"});
        } else {
            console.log("200");
            res.status(200);
            res.json("Teacher code is active.");
        }
    });
});

teacherCodeRoutes.route('/delete/:code').get(function(req, res) {
    TeacherCode.findOneAndRemove({"code":req.params.code}, function(err, code) {
        if(err || code === null) {
            console.log(err);
            res.status(400);
            res.json({"message" : "Error activating account"});
        } else {
            res.status(200);
            res.json("Successfully deleted activation code " + req.params.code);
        }
    });
});

module.exports = teacherCodeRoutes;
