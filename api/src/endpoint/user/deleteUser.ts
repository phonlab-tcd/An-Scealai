import User from "../../models/user";
import { API500Error } from "../../utils/APIError";
import authenticated_user from "../../utils/authenticated_user";

export default async function deleteUser(req, res, next) {
  const user = authenticated_user(req);
  console.log("deleting user", user);
  const user_result = await User.findOneAndRemove({_id: user._id}).then(ok=>({ok}), err=>({err}));
  if("err" in user_result) return next(new API500Error("failed to delete user"));
  return res.sendStatus(200);
}