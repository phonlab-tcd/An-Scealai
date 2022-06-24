import Story from '../../model/story';
import { RequestHandler } from 'express';
import * as ERROR from '../../util/APIError';

export type OkResponse = {id: string};

export const post: RequestHandler = async function(req, res, next) {
  const story = await Story.create(req.body);
  if (!story) return next(new ERROR.API500Error('Unable to save story to DB.'));
  const response: OkResponse = {id: story._id.toString()};
  res.json(response);
};
