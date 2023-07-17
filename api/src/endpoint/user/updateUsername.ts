import User from "../../models/user";
import { API404Error } from "../../utils/APIError";
import { Request, Response } from "express";

export default async function updateUsername(req: Request, res: Response) {
  const user = await User.findById(req.params.id);

  if (!user) throw new API404Error(`No users with this id were found.`);

  user.username = req.body.newUsername;

  try {
    await user.save();
    return res.status(200).json('Username updated successfully');
  } catch (err) {
    console.warn(new Error("failed to save user"), user, req.params)
    return res.status(500).send(err);
  }
}