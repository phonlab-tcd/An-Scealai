// @ts-nocheck
const express = require('express');
const classroomRoutes = express.Router();
const Classroom = require('../models/classroom');

/**
 * Create a new classroom
 * @param {Object} req body: Classroom object
 * @return {Object} Success or error message
 */
classroomRoutes.route('/create').post((req, res) => {
  const classroom = new Classroom(req.body);
  classroom.save().then((classroom) => {
    res.status(200).json({'message': 'classroom created successfully'});
  }).catch((err) => {
    res.status(400).send('Unable to save to DB');
  });
});

/**
 * Get all classrooms
 * @return {Array} List of all classrooms
 */
classroomRoutes.route('/').get((req, res) => {
  Classroom.find({}, (err, classrooms) => {
    if (classrooms) {
      res.json(classrooms);
    } else {
      req.json({message: 'No classrooms were found', status: 404});
    }
  });
});

/**
 * Get all the codes for all the classrooms
 * @return {Array} A list of all the codes
 */
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

/**
 * Get a classroom by its ID
 * @param {Object} req params: id
 * @return {Object} Classroom object with corresponding ID
 */
classroomRoutes.route('/:id').get((req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) {
      res.json(err);
    } else {
      res.json(classroom);
    }
  });
});

/**
 * Get all classrooms for a given teacher
 * @param {Object} req params: teacher ID
 * @return {Array} List of all the teacher's classrooms
 */
classroomRoutes.route('/forTeacher/:id').get((req, res) => {
  Classroom.find({'teacherId': req.params.id}, (err, classrooms) => {
    if (err) {
      res.json(err);
    } else {
      res.json(classrooms);
    }
  });
});

/**
 * Update a classroom title
 * @param {Object} req params: Classroom ID
 * @return {Object} Success or error message
 */
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

/**
 * Delete a classroom
 * @param {Object} req params: Classroom ID
 * @return {Object} Success or error message
 */
classroomRoutes.route('/delete/:id').get((req, res) => {
  Classroom.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully removed classroom');
    }
  });
});

/**
 * Delete all the classrooms for a given teacher
 * @param {Object} req params: Teacher ID
 * @return {Object} Success or error message
 */
classroomRoutes.route('/deleteAllClassrooms/:teacherId').get((req, res) => {
  Classroom.deleteMany({'teacherId': req.params.teacherId}, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Successfully removed all classrooms for teacher id');
    }
  });
});

/**
 * Find a classroom corresponding to a paritcular code
 * @param {Object} req params: The classroom code
 * @return {Object} Classroom object
 */
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

/**
 * Add a student to a classroom
 * @param {Object} req params: The student's id number
 * @return {Object} Success or error message
 */
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

/**
 * Remove a student from a classroom
 * @param {Object} req params: The student's id number
 * @return {Object} Success or error message
 */
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

/**
 * Get the classroom for the given student
 * @param {Object} req params: The student's id number
 * @return {Object} Classroom object
 */
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

/**
 * Set the list of grammar checkers for a given classroom
 * @param {Object} req params: Classroom ID
 * @return {Object} Success or error message
 */
classroomRoutes.route('/setClassroomCheckers/:id').post((req, res) => {
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

/**
 * Get the list of grammar checkers for a given classroom
 * @param {Object} req params: Classroom ID
 * @return {Array} List of grammar checkers
 */
classroomRoutes.route('/getClassroomCheckers/:id').get( (req, res) => {
  Classroom.findById(req.params.id, (err, classroom) => {
    if (err) res.json(err);
    if (classroom) res.json(classroom.grammarCheckers);
  });
});

/**
 * Get total number of classrooms
 * @param {Object} req
 * @return {Number} Number of total classrooms
 */
classroomRoutes.route('/getTotalClassrooms/allDB').get( async (req, res) => {
  const totalClassrooms = await Classroom.find().countDocuments();
  return res.status(200).json(totalClassrooms);
});

module.exports = classroomRoutes;
