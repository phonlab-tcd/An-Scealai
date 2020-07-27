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
* Update a student's grammar error count and error time stamps given user id
* Loop through each error currently recorded in the DB and see if the error matches
* one of the new errors given. If a match is found, entry is deleted.  Any left over
* entries are then added as new errors to the DB
* Different cases: 
*   Case 1) If new error matches DB error => add new count if not the same as previous
*   Case 2) If DB has had error before not error has been resolved => add a 0 to previous count
*   Case 3) If DB has not seen this error => add it and its count to the DB
*/
studentStatsRoutes.route('/updateGrammarErrors/:id/:updatedTimeStamp').post(function (req, res) {
    StudentStats.findOne({"studentId": req.params.id}, function(err, stat) {
        if(err) res.json(err);
        if(stat === null) {
            console.log("stat is null!");
        } else {
          let newErrors = Object.entries(req.body);
          console.log(newErrors);
          console.log(stat.grammarErrors);
          // loop through db errors
          for(let entry of stat.grammarErrors) {
            let originalAmount = entry[1];
            let dateArray = [];
            let errorFound = false;
            // loop through new errors
            for(let i = 0; i < newErrors.length; i++) {
              if(entry[0] === newErrors[i][1][0]) {
                errorFound = true;
                console.log("original amount: " + originalAmount[originalAmount.length -1]);
                console.log("amount to add: " + newErrors[i][1][1].length);
                // Case 1
                if(originalAmount[originalAmount.length -1] !== newErrors[i][1][1].length) {
                  originalAmount.push(newErrors[i][1][1].length);
                  stat.grammarErrors.set(entry[0], originalAmount);
                  dateArray = stat.timeStamps.get(entry[0]);
                  dateArray.push(req.params.updatedTimeStamp);
                  stat.timeStamps.set(entry[0], dateArray);
                }
                // delete new error from array to speed up process
                const index = newErrors.indexOf(newErrors[i]);
                if (index > -1) {
                  newErrors.splice(index, 1);
                  console.log("entry deleted");
                }
              }
            }
            // Case 2
            if(!errorFound && (originalAmount[originalAmount.length -1] !== 0)) {
              originalAmount.push(0);
              stat.grammarErrors.set(entry[0], originalAmount);
              dateArray = stat.timeStamps.get(entry[0]);
              dateArray.push(req.params.updatedTimeStamp);
              stat.timeStamps.set(entry[0], dateArray);
              errorFound = false;
            }
          }
          // Case 3
          for(let i = 0; i < newErrors.length; i++) {
              originalAmount = [];
              originalAmount.push(newErrors[i][1][1].length);
              stat.grammarErrors.set(newErrors[i][1][0], originalAmount);
              dateArray = [];
              dateArray.push(req.params.updatedTimeStamp);
              stat.timeStamps.set(newErrors[i][1][0], dateArray);
              console.log("new error entry added");
          }
          
          console.log("Updated errors in db: ");
          console.log(stat.grammarErrors);
          console.log(stat.timeStamps);

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