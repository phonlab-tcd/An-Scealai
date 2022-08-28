import type { RequestHandler } from "express";
const Story = require('../../models/story');
const mine: RequestHandler = async function (req,res,next) {
    console.log(req.url);
    const { _id } = (req as any).user;
    console.log(req.user);
    const stories = await Story.find({$or: [{owner: _id}, {studentId: _id}]})
        .then(ok=>({ok}),err=>({err}));
    if(stories.err){
        console.error(req.url,stories.err);
        return res.status(400).json(stories.err.message);
    }
    console.log(stories.ok);
    return res.json(stories.ok);
}
export = mine;
