import User from "../../models/user";
import { Request, Response } from "express";

/**
* Count the number of uses with English and Irish langauge settings
* @param {Object} req
* @param {Object} res
* @return {Promise} Number of English and Irish users
*/
export default async function getLanguageCount(req: Request, res: Response) {
  const englishCount = await User.find({'language': 'en'}).countDocuments();
  const irishCount = await User.find({'language': 'ga'}).countDocuments();

  return res.status(200).json({
    englishCount: englishCount,
    irishCount: irishCount,
  });
}