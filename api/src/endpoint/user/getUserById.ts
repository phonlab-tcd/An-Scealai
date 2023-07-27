import User from "../../models/user";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  function fail() {
    res.status(400).json("unexpected error");
  }

  const user = await User.findById(req.params.id).then(ok => ({ ok }), err => ({ err }))

  if ("err" in user) {
    fail();
    console.warn(new Error("/user/getUserById findById"), user);
    return;
  }

  if (!user.ok) return fail();

  return res.json(user.ok);
}