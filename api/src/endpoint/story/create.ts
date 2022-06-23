import Express from 'express';
import Story from '../../model/story';
import * as ERROR from '../../util/APIError';

// export type OkResponse = {id:string};

type mwargs = [Express.Request, Express.Response, (error?: Error)=>void];
type mw = (...args: mwargs)=>void;
export type OkResponse = {id:string};

export const post: mw  = async function(req, res) {
  const story = await Story.create(req.body);
  if (!story) throw new ERROR.API500Error('Unable to save story to DB.')
  const response: OkResponse = {id: story._id};
  res.json(response);
};
