const express = require('express');
const app = express();
const teacherCodeRoutes = express.Router();

let TeacherCode = require('../models/TeacherCode');

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
    } else {
        res.json(teacherCodes);
    }
    });
});

teacherCodeRoutes.route('/delete/:code').get(function(req, res) {
    TeacherCode.findOneAndRemove({"code":req.params.code}, function(err) {
        if(err) {
            res.status(400).json({'message' : "Invalid code"});
        } else {
            res.status(200)
            res.json("Successfully deleted activation code " + req.params.code);
        }
    });
});

module.exports = teacherCodeRoutes;