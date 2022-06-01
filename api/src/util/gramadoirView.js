const mongoose = require('mongoose');
const User = require('../model/user');

module.exports = async (view_name='gramadoir_view') => {
  await mongoose.connect('mongodb://localhost:27017/an-scealai');
  const { db } = mongoose.connection;
  await db.createCollection(view_name, {
    viewOn: 'gramadoir.story.history',
    pipeline: [
      {$unwind: {
        path: "$versions",
        includeArrayIndex: "versionIdx",
      }},
      {$replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", "$versions"]
        },
      }},
      {$unset: 'versions'},
      {$lookup: {
        from: 'gramadoir.cache',
        localField: 'gramadoirCacheId',
        foreignField: '_id',
        as: 'gramadoir',
      }},
      {$project: {
        ownerId: 1,
        storyId: 1,
        gramadoir: {$arrayElemAt: ['$gramadoir', 0]}
      }},
      {$unset: 'gramadoirCacheId'},
      {$group: {
        _id: {
          storyId: "$storyId",
        },
        gramadoirHistory: {
          $addToSet: "$$ROOT"
        },
      }},
    ]
  });
  return;
};
