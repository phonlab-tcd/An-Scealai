const express = require('express');
const classroomRoutes = express.Router();

const Classroom = require('../models/classroom');

classroomRoutes.route('/create').post((req, res) => {
  const classroom = new Classroom(req.body);
  classroom.save().then((classroom) => {
    res.status(200).json({'message': 'classroom created successfully'});
  }).catch((err) => {
    res.status(400).send('Unable to save to DB');
  });
});

classroomRoutes.route('/getAllCodes').get((req, res) => {
  Classroom.find({}, (err, classrooms) => {
    if (err) {
      res.json(err);
    } else {
      const codes = [];
      for (const classroom of classrooms) {
        if (classroom.code != null) {
          codes.push(classroom.code);
        }
      }
      res.json(codes);
    }
  });
});

classroomRoutes.route('/:id').get((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.json(err);
    } else {
      res.json(classroom);
    }
  });
});

classroomRoutes.route('/forTeacher/:id').get((req, res) => {
  Classroom.find({'teacherId': req.params.id}, (err, classrooms) => {
    if (err) {
      res.json(err);
    } else {
      res.json(classrooms);
    }
  });
});

classroomRoutes.route('/updateTitle/:id').post((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.status(400).json(err);
    }
    if (classroom) {
      classroom.title = req.body.title;
      classroom.save().then((classroom) => {
        res.status(200).json('Updated classroom title successfully');
      }).catch((err) => {
        res.status(404).send(err);
      });
    }
  });
});

classroomRoutes.route('/delete/:id').get((req, res) => {
  Classroom.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully removed classroom');
    }
  });
});

classroomRoutes.route('/deleteAllClassrooms/:teacherId').get((req, res) => {
  Classroom.deleteMany({'teacherId': req.params.teacherId}, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully removed all classrooms for teacher id');
    }
  });
});

classroomRoutes.route('/getClassroomForCode/:code').get((req, res) => {
  Classroom.findOne({'code': req.params.code}, (err, classroom) => {
    if (err) {
      res.json({message: 'Error finding classroom', found: false});
    }
    if (classroom) {
      res.json({classroom: classroom, found: true});
    } else {
      res.json({message: 'No classroom with this code exists', found: false});
    }
  });
});

classroomRoutes.route('/addStudent/:id').post((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.json(err);
    }
    if (classroom) {
      if (!classroom.studentIds.includes(req.body.studentId)) {
        classroom.studentIds.push(req.body.studentId);
        classroom.save();
        res.json({message: 'Student added succesfully', status: 200});
      } else {
        res.status(409).json('Student is already a member of this classroom');
      }
    }
  });
});

classroomRoutes.route('/removeStudent/:id').post((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.json(err);
    }
    if (classroom) {
      const index = classroom.studentIds.indexOf(req.body.studentId);
      if (index !== -1) {
        // remove the id at index
        // [ ... id[n], id[index], id[n+2], ... ] => [ ... id[n], id[n+2], ... ]
        classroom.studentIds.splice(index, 1);
        classroom.save();
        res.status(200).json('Student removed successfully');
      } else {
        res.status(404).json('This student ID is not associated with the classroom');
      }
    }
  });
});

classroomRoutes.route('/getClassroomForStudent/:studentId').get((req, res) => {
  Classroom.findOne({studentIds: {$all: [req.params.studentId]}}, (err, classroom) => {
    if (classroom) {
      res.json(classroom);
    } else {
      // res.json({message: "No classrooms were found", status: 404});
      res.json(err);
    }
  });
});

classroomRoutes.route('/').get((req, res) => {
  Classroom.find({}, (err, classrooms) => {
    if (classrooms) {
      res.json(classrooms);
    } else {
      req.json({message: 'No classrooms were found', status: 404});
    }
  });
});

classroomRoutes.route('/setGrammarRules/:id').post((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.status(400).json(err);
    }
    if (classroom) {
      classroom.grammarRules = req.body.grammarRules;
      classroom.save().then((classroom) => {
        res.status(200).json('Updated grammar rules successfully');
      }).catch((err) => {
        res.status(404).send(err);
      });
    }
  });
});

classroomRoutes.route('/getGrammarRules/:id').get( (req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) res.json(err);
    if (classroom) res.json(classroom.grammarRules);
  });
});

classroomRoutes.route('/updateClassroomCheckers/:id').post((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.status(400).json(err);
    }
    if (classroom) {
      classroom.grammarCheckers = req.body.checkers;
      classroom.save().then((classroom) => {
        res.status(200).json('Updated grammar checkers successfully');
      }).catch((err) => {
        res.status(404).send(err);
      });
    }
  });
});

classroomRoutes.route('/getClassroomCheckers/:id').get( (req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) res.json(err);
    if (classroom) res.json(classroom.grammarCheckers);
  });
});

module.exports = classroomRoutes;
