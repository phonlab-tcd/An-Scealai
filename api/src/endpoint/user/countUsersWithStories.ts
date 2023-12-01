import User from "../../models/user";
import { Request, Response } from "express";


/**
* Returns the number of students who have written at least one story
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of students who have at least one story
*/
export default async function countUsersWithStories(req: Request, res: Response) {
  try {
    let totalUsersWithAStory = 0;
    const result = await User.aggregate([
      {
        $lookup: {
          from: 'story',
          localField: '_id',
          foreignField: 'owner',
          as: 'stories'
        }
      },
      {
        $match: {
          stories: { $exists: true, $ne: [] }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    totalUsersWithAStory = result.length > 0 ? result[0].count : 0;
    return res.status(200).json(totalUsersWithAStory);
  } catch (error: any) {
    console.error('Error:', error.message);
    return res.status(500).json('Error calculating the number of students who have at least one story');
  }
}