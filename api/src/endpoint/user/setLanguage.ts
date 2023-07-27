import User from "../../models/user";
import { Request, Response } from "express";

export default async function setLanguage(req: Request, res: Response) {
  User.findById(req.params.id, (err, user) => {
    if (user) {
      user.language = req.body.language;
      user.save().then(
        () => res.status(200).json('Language set successfully'),
        (err) => {
          console.error(new Error("failed to save"), err);
          res.status(400).send(err);
        });
    }
  });
};
