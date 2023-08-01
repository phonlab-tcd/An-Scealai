import { Request, Response } from "express";
import Story from "../../models/story";

module.exports = async (req, res) => {
  Story.findById(req.params.id, function (err, story) {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (story === null) {
      return res.status(404).json("story not found");
    }

    if (req.body.seconds) {
        story.timeSpentOnStory = (story.timeSpentOnStory ?? 0) + req.body.seconds;
    } 

    story.save().then(
      () => res.json("Update story writing time complete"),
      (err) => res.status(400).json(err)
    );
  });
}
