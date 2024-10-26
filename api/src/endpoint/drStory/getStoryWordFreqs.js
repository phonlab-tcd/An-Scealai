const DigitalReaderStory = require("../../models/drStory");
const mongoose = require("mongoose");
const { API404Error } = require("../../utils/APIError");

/**
 * Get given student's stories written whithen the given date range
 * @param {Object} req The student's id number
 * @param {Object} res The object to store the response
 * @return {Promise} Student's stories within date range
 */
module.exports = async (req, res) => {
  //let ownerId = null;

  /*try {
    ownerId = new mongoose.mongo.ObjectId(req.params.studentId);
  } catch (error) {
    return res.status(404).json(`id ${req.params.studentId} is not a valid ObjectId`);
  }*/

  // if (req.body.lemma === "" || req.body.tags === "") {
  //   return res.status(200).json([]);
  // }

  try {
    const digitalReaderStories = await DigitalReaderStory.aggregate([
      {$project: {
        sentences: "$story.sentences",
        words: "$story.words",
        public: 1
      }},
      {$match: {
        public: true
      }},
      {
        $group: {
          _id: null,                       
          allWords: { $push: "$words" }
        }
      },
      {
        $project: {
          _id: 0,
          allWords: { $reduce: {
            input: "$allWords",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }},
          public: 1
        }
      },
      
      {
       $project: {
        words: {$map: {
              input: "$allWords",
              as: "item",
              in: {$concat: ["$$item.attrs.tags", "_", "$$item.attrs.lemma"]}
            }},
        public: 1
      } 
      },
      {$addFields:{
        words: {$map: {
             input: {$setUnion:"$words"},
             as: "tag_lemma", 
             in: {
                  tag_lemma: "$$tag_lemma",
                  count: {$size: {$filter:{input:"$words", cond:{$eq:["$$this", "$$tag_lemma"]}}}}
             }
        }}
    }}
    ])

    if (!digitalReaderStories) {
      res.status(200).json([]);
    } else {
      res.status(200).json(digitalReaderStories);
    }
  } catch {
    return res.status(200).json([]);
  }
  
};
