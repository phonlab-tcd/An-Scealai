"use strict";
var express = require('express');
var app = express();
var classroomRoutes = express.Router();
var Classroom = require('../models/classroom');
classroomRoutes.route('/create').post(function (req, res) {
    var classroom = new Classroom(req.body);
    classroom.save().then(function (classroom) {
        res.status(200).json({ "message": "classroom created successfully" });
    }).catch(function (err) {
        res.status(400).send("Unable to save to DB");
    });
});
classroomRoutes.route('/getAllCodes').get(function (req, res) {
    Classroom.find({}, function (err, classrooms) {
        if (err) {
            res.json(err);
        }
        else {
            var codes = [];
            for (var _i = 0, classrooms_1 = classrooms; _i < classrooms_1.length; _i++) {
                var classroom = classrooms_1[_i];
                if (classroom.code != null) {
                    codes.push(classroom.code);
                }
            }
            res.json(codes);
        }
    });
});
classroomRoutes.route('/:id').get(function (req, res) {
    Classroom.findById(req.params.id, function (err, classroom) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(classroom);
        }
    });
});
classroomRoutes.route('/forTeacher/:id').get(function (req, res) {
    Classroom.find({ "teacherId": req.params.id }, function (err, classrooms) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(classrooms);
        }
    });
});
classroomRoutes.route('/updateTitle/:id').post(function (req, res) {
    Classroom.findById(req.params.id, function (err, classroom) {
        if (err) {
            res.status(400).json(err);
        }
        if (classroom) {
            classroom.title = req.body.title;
            classroom.save().then(function (classroom) {
                res.status(200).json("Updated classroom title successfully");
            }).catch(function (err) {
                res.status(404).send(err);
            });
        }
    });
});
classroomRoutes.route('/delete/:id').get(function (req, res) {
    Classroom.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.json(err);
        }
        else {
            res.json("Successfully removed classroom");
        }
    });
});
classroomRoutes.route('/deleteAllClassrooms/:teacherId').get(function (req, res) {
    Classroom.deleteMany({ "teacherId": req.params.teacherId }, function (err) {
        if (err) {
            res.json(err);
        }
        else {
            res.json("Successfully removed all classrooms for teacher id");
        }
    });
});
classroomRoutes.route('/getClassroomForCode/:code').get(function (req, res) {
    Classroom.findOne({ "code": req.params.code }, function (err, classroom) {
        if (err) {
            res.json({ message: "Error finding classroom", found: false });
        }
        if (classroom) {
            res.json({ classroom: classroom, found: true });
        }
        else {
            res.json({ message: "No classroom with this code exists", found: false });
        }
    });
});
classroomRoutes.route('/addStudent/:id').post(function (req, res) {
    Classroom.findById(req.params.id, function (err, classroom) {
        if (err) {
            res.json(err);
        }
        if (classroom) {
            if (!classroom.studentIds.includes(req.body.studentId)) {
                classroom.studentIds.push(req.body.studentId);
                classroom.save();
                res.json({ message: "Student added succesfully", status: 200 });
            }
            else {
                res.status(409).json("Student is already a member of this classroom");
            }
        }
    });
});
classroomRoutes.route('/removeStudent/:id').post(function (req, res) {
    Classroom.findById(req.params.id, function (err, classroom) {
        if (err) {
            res.json(err);
        }
        if (classroom) {
            var index = classroom.studentIds.indexOf(req.body.studentId);
            if (index !== -1) {
                classroom.studentIds.splice(index, 1);
                classroom.save();
                res.status(200).json("Student removed successfully");
            }
            else {
                res.status(404).json("This student ID is not associated with the classroom");
            }
        }
    });
});
classroomRoutes.route('/getClassroomForStudent/:studentId').get(function (req, res) {
    Classroom.findOne({ studentIds: { $all: [req.params.studentId] } }, function (err, classroom) {
        if (classroom) {
            res.json(classroom);
        }
        else {
            //res.json({message: "No classrooms were found", status: 404});
            res.json(err);
        }
    });
});
classroomRoutes.route('/').get(function (req, res) {
    Classroom.find({}, function (err, classrooms) {
        if (classrooms) {
            res.json(classrooms);
        }
        else {
            req.json({ message: "No classrooms were found", status: 404 });
        }
    });
});
classroomRoutes.route('/setGrammarRules/:id').post(function (req, res) {
    Classroom.findById(req.params.id, function (err, classroom) {
        if (err) {
            res.status(400).json(err);
        }
        if (classroom) {
            classroom.grammarRules = req.body.grammarRules;
            classroom.save().then(function (classroom) {
                res.status(200).json("Updated grammar rules successfully");
            }).catch(function (err) {
                res.status(404).send(err);
            });
        }
    });
});
classroomRoutes.route('/getGrammarRules/:id').get(function (req, res) {
    Classroom.findById(req.params.id, function (err, classroom) {
        if (err)
            res.json(err);
        if (classroom)
            res.json(classroom.grammarRules);
    });
});
module.exports = classroomRoutes;
