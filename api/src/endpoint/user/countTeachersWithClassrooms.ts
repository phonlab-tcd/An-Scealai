import User from "../../models/user";
import { Request, Response } from "express";

/**
* Returns the number of teachers who have at least one classroom
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of teachers who have at least one classroom
*/
export default async function countTeachersWithClassrooms(req: Request, res: Response) {
  try {
    let totalTeachersWithAClassroom = 0;
    const result = await User.aggregate([
      {
        $lookup: {
          from: 'classroom',
          localField: '_id',
          foreignField: 'teacherId',
          as: 'classrooms'
        }
      },
      {
        $match: {
          classrooms: { $exists: true, $ne: [] }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    totalTeachersWithAClassroom = result.length > 0 ? result[0].count : 0;
    return res.status(200).json(totalTeachersWithAClassroom);
  } catch (error: any) {
    console.error('Error:', error.message);
    return res.status(500).json('Error calculating the number of teachers who have at least one classroom');
  }
}
