import User from "../../models/user";
import { API404Error } from "../../utils/APIError";
import { Request, Response } from "express";

export default async function updateUsername(req: Request, res: Response) {
  const user = await User.findById(req.params.id);

  if (!user) throw new API404Error(`No users with this id were found.`);

  user.username = req.body.newUsername;
  user.save().then(
    () => {
      return res.status(200).json("Username updated successfully");
    },
    (err) => {
      console.log(err.code);
      console.error(new Error("failed to update username"), err);
      return res.status(400).json({ code: err.code });
    }
  );
}
