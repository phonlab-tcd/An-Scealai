const express = require('express');
const app = express();
const classroomRoutes = express.Router();

let Classroom = require('../models/classroom');

classroomRoutes.route('/create').post((req, res) => {
    let classroom = new Classroom(req.body);
    classroom.save().then(classroom => {
        res.status(200).json({"message" : "story added successfully"});
    }).catch(err => {
        res.status(400).send("Unable to save to DB");
    });
});

classroomRoutes.route('/getAllCodes').get((req, res) => {
    Classroom.find({}, (err, classrooms) => {
        if(err) {
            res.json(err);
        } else {
            let codes = [];
            for(let classroom of classrooms) {
                console.log("classroom", classroom);
                if(classroom.code != null) {
                    codes.push(classroom.code);
                }
            }
            res.json(codes);
        }
    })
});

classroomRoutes.route('/:id').get((req, res) => {
    Classroom.findById(req.params.id, (err, classroom) => {
        if(err) {
            res.json(err);
        } else {
            res.json(classroom);
        }
    });
});

classroomRoutes.route('/forTeacher/:id').get((req, res) => {
    Classroom.find({"teacherId" : req.params.id}, (err, classrooms) => {
        if(err) {
            res.json(err);
        } else {
            res.json(classrooms);
        }
    });
});

classroomRoutes.route('/updateTitle/:id').post((req, res) => {
    Classroom.findById(req.params.id, (err, classroom) => {
        if(err) {
            res.status(400).json(err);
        }
        if(classroom) {
            classroom.title = req.body.title;
            classroom.save().then(classroom => {
                res.status(200).json("Updated successfully");
            }).catch(err => {
                res.status(404).send(err);
            });
        }
    });
});

classroomRoutes.route('/delete/:id').get((req, res) => {
    Classroom.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.json(err);
        } else {
            res.json("Successfully removed");
        }
    });
});

classroomRoutes.route('/addStudent/:id').post((req, res) => {
    Classroom.findById(req.params.id, (err, classroom) => {
        if(err) {
            res.json(err);
        }
        if(classroom) {
            if(!classroom.studentIds.includes(req.body.studentId)) {
                classroom.studentIds.push(req.body.studentId);
                classroom.save();
                res.status(200).json("Student added succesfully");
            } else {
                res.status(409).json("Student is already a member of this classroom");
            }
        }
    });
});

classroomRoutes.route('/removeStudent/:id').post((req, res) => {
    Classroom.findById(req.params.id, (err, classroom) => {
        if(err) {
            res.json(err);
        }
        if(classroom) {
            let index = classroom.studentIds.indexOf(req.body.studentId);
            if(index !== -1) {
                classroom.studentIds.splice(index, 1);
                classroom.save();
                res.status(200).json("Student removed successfully");
            } else {
                res.status(404).json("This student ID is not associated with the classroom");
            }
            
        }
    });
});

module.exports = classroomRoutes;