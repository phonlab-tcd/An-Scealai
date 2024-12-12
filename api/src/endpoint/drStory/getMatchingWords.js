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

  //const conditions = { owner: ownerId };
  const conditions = {public: true};
  if (req.body.lemma === "" || req.body.tags === "") {
    return res.status(200).json([]);
  }

  /*try {
    const digitalReaderStories = await DigitalReaderStory.aggregate([
      {$project: {
        title: 1,
        sentences: "$story.sentences",
        words: "$story.words",
        public: 1
      }},
      {$match: {
        public: true
      }},
      {$project: {
        title: 1,
        sentences: 1,
        words: 1,
        sent_ids: {
          $map: {
            input: {
              $filter: {
                input: "$words",
                as: "word",
                cond: {
                  $and: [
                    {
                      $eq: ["$$word.attrs.lemma", req.body.lemma]
                    },
                    {
                      $eq: ["$$word.attrs.tags", req.body.tags]
                    },
                  ]
                }
              }
            },
            as: "word",
            in: "$$word.attrs.sentid"
          }
        }
      }},
      {$project: {
        title: 1,
        sentences: {
          $filter: {
            input: "$sentences",
            as: "sentence",
            cond: {
              $in: ["$$sentence.id", "$sent_ids"]
            }
          }
        },
        words: {
          $filter: {
            input: "$words",
            as: "word",
            cond: {
              $in: ["$$word.attrs.sentid", "$sent_ids"]
            }
          }
        }
      }},
      {$project: {
        sentences: {
          $map: {
            input: "$sentences",
            as: "sentence",
            in: {
              sent: "$$sentence",
              words: {
                $filter: {
                  input: "$words",
                  as: "word",
                  cond: {
                    $eq: [
                      "$$word.attrs.sentid",
                      "$$sentence.id"
                    ]
                  }
                }
              },
              obj_id: "$_id",
              title: "$title"
            }
          }
        }
      }},
      {$match: { 
        "sentences.0": {
            "$exists": true 
        }
      }}
    ])

    if (!digitalReaderStories) {
      res.status(200).json([]);
    } else {
      res.status(200).json(digitalReaderStories);
    }
  }*/
  try {
    const digitalReaderStories = await DigitalReaderStory.aggregate([
      {$project: {
        title: 1,
        sentences: "$story.sentences",
        words: "$story.words",
        public: 1
      }},
      {$match: {
        public: true
      }},
      {$project: {
        title: 1,
        sentences: 1,
        words: 1,
        sent_ids: {
          $map: {
            input: {
              $filter: {
                input: "$words",
                as: "word",
                cond: {
                    $eq: ["$$word.attrs.lemma", req.body.lemma]
                }
              }
            },
            as: "word",
            in: "$$word.attrs.sentid"
          }
        }
      }},
      {$project: {
        title: 1,
        sentences: {
          $filter: {
            input: "$sentences",
            as: "sentence",
            cond: {
              $in: ["$$sentence.id", "$sent_ids"]
            }
          }
        },
        words: {
          $filter: {
            input: "$words",
            as: "word",
            cond: {
              $in: ["$$word.attrs.sentid", "$sent_ids"]
            }
          }
        }
      }},
      {$project: {
        sentences: {
          $map: {
            input: "$sentences",
            as: "sentence",
            in: {
              sent: "$$sentence",
              words: {
                $filter: {
                  input: "$words",
                  as: "word",
                  cond: {
                    $eq: [
                      "$$word.attrs.sentid",
                      "$$sentence.id"
                    ]
                  }
                }
              },
              obj_id: "$_id",
              title: "$title"
            }
          }
        }
      }},
      {$match: { 
        "sentences.0": {
            "$exists": true 
        }
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
