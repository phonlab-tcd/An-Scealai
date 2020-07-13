const express = require('express');
const app = express();
const studentStatsRoutes = express.Router();

let StudentStats = require('../models/studentStats');

// Create new stat entry in database
studentStatsRoutes.route('/create').post(function (req, res) {
    let stat = new StudentStats(req.body);
    stat.save().then(stat => {
        res.status(200).json({'message': 'stat entry added successfully'});
    })
    .catch(err => {
        res.status(400).send("unable to save to DB");
    });
});

// Get all stat objects from given classroom 
studentStatsRoutes.route('/getStatsByClassroom/:id').get((req, res) => {
    StudentStats.find({classroomId: req.params.id}, (err, stats) => {
        if(err) res.json(err);
        if(stats) res.json(stats);
    });
});

// Get the grammar erorr map given the student id
studentStatsRoutes.route('/getErrors/:id').get(function (req, res) {
  StudentStats.findOne({"studentId": req.params.id}, function(err, stat){
    if(err) {
        res.status(400).json({"message" : err.message});
    } else {
      let data = stat.grammarErrors;
      res.json(data);
    }
  });
});

/*
* Update a student's grammar error count given user id
*/
studentStatsRoutes.route('/updateGrammarErrors/:id').post(function (req, res) {
    StudentStats.findOne({"studentId": req.params.id}, function(err, stat) {
        if(err) res.json(err);
        if(stat === null) {
            console.log("stat is null!");
        } else {
          //loop through param map input and update stats map where the keys match
          // (a particular grammar error)
          for(let entry of req.body) {
            let originalAmount = parseInt(stat.grammarErrors.get(entry[0]));
            let amountToAdd = parseInt(entry[1].length);
            console.log("Original amount: " + originalAmount);
            console.log("Amount to add : " + amountToAdd);
            //calculate number of a particular grammar error 
            if(originalAmount == null || isNaN(originalAmount)) {
              stat.grammarErrors.set(entry[0], amountToAdd);
            }
            else {
              let newAmount = originalAmount + amountToAdd;
              stat.grammarErrors.set(entry[0], newAmount);
            }
            console.log("New amount: " + stat.grammarErrors.get(entry[0]));
          }
          
          stat.save().then(stat => {
              res.json('Update complete');
          }).catch(err => {
              res.status(400).send("Unable to update");
          });
      
        }
    });
});

// Delete stat entry by student ID
studentStatsRoutes.route('/delete/:id').get(function(req, res) {
  console.log("Delete entry");
    StudentStats.findOneAndRemove({"studentId": req.params.id}, function(err, stat) {
        if(err) res.json(err);
        else res.json("Successfully removed");
    });
});


module.exports = studentStatsRoutes;