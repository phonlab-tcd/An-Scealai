import { Request, Response } from "express";
import User from "../../models/user";
import path from "path";
import result from "../../utils/result";

/**
 * Set a user's status to Active when they click on the activation link
 * @param {Object} req query: username, email, verification code
 * @param {Object} res
 * @return {Promise} Success or error message
 */
export default async function verify (req: Request, res: Response) {
  function fail(){
    res.status(400).send('<h1>Sorry</h1><p>That didn\'t work.</p>');
  }

  if (!req.query.username) {
    return res.status(400).json('username required to verify account email address');
  }
  if (!req.query.email) {
    return res.status(400).json('email required to verify account email address');
  }
  if (!req.query.verificationCode) {
    return res.status(400).json('verificationCode required to verify account email address');
  }

  const user_result = await result( User.findOne({username: req.query.username, email: req.query.email}) );

  if("err" in user_result) return fail();
  const user = user_result.ok;
  if (!user) return fail();
  if (user.verification.code !== req.query.verificationCode) return fail();


  user.status = 'Active';
  const save = await result( user.save() );
  if ("err" in save) return fail()

  return res.sendFile(path.join(__dirname, '../../views/account_verification.html'));
};