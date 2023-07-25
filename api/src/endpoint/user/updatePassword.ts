import User from "../../models/user";
import { Request, Response } from "express";
import crypto from "node:crypto";
import pbkdf2 from "../../utils/pbkdf2";
import { z } from "zod";
import authenticated_user from "../../utils/authenticated_user";

const password = z.string().min(5);

export default async function updatePassword(req: Request, res: Response) {
  const user = authenticated_user(req);
  const salt = crypto.randomBytes(16).toString("hex");
  // if(!password.safeParse(req.body.password).success) return res.status(400).json("unacceptable password");
  const hash = (await pbkdf2(req.body.password, salt, 1000, 64, "sha512")).toString("hex");
  console.log(hash);
  const update = await User.findOneAndUpdate(
    {_id: user._id},
    {$set:{salt,hash}})
    .then(ok=>({ok}), err=>({err}));

  if("err" in update) {
    console.error(new Error("updating user password"), update, user);
    return res.status(500).json("update failed");
  }

  return res.json("Password updated successfully");
}