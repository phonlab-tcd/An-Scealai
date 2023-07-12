import User from "../../models/user";
import Story from "../../models/story";
import { Request, Response } from "express";


/**
* Returns the number of students who have written at least one story
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of students who have at least one story
*/
export default async function countUsersWithStories(req: Request, res: Response) {
  const users = await User.find({'role': 'STUDENT'}, {'username': 1, '_id': 0});
  const owners = users.map(u => u._id);

  let usersWithStories = 0;

  // count the number of users that have written at least one story
  // TODO author is deprecated use "story._id"
  // OUCH! that's a long for loop! (neimhin 12/07/23)
  for (const owner of owners) {
    const numOfStories = await Story.find({owner}).countDocuments();

    if (numOfStories > 0) {
      usersWithStories++;
    }
  }

  return res.status(200).json(usersWithStories);
}