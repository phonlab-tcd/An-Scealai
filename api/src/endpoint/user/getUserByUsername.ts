import User from "../../models/user";
import { ObjectId } from "mongodb";
import { z } from "zod";

const oid_schema = z.string().refine(i=>new ObjectId(i));

const safe_user_schema = z.object({
  _id: oid_schema,
  username: z.string().nonempty(),
  role: z.enum(["STUDENT", "TEACHER"]),
});

export default async function (req, res) {
  const user_result = await User.find({username: req.params.username}).then(ok=>({ok}), err=>({err}))

  if ("err" in user_result) {
    console.error(new Error("User.find error"), user_result.err, req.params);
    return res.status(500).json("error");
  }

  if(!user_result.ok) {
    return res.status(404).json("User not found");
  }

  const public_user = safe_user_schema.safeParse(user_result.ok);

  if(!public_user.success) {
    console.error(new Error("parse public user data"), public_user, user_result);
    return res.status(500).json("error");
  }

  return res.json(public_user.data);
}
