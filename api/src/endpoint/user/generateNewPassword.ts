import User from "../../models/user";
import * as _aws_ses from "../../utils/aws-ses-send-email";
import { Request, Response } from "express";
import { z } from "zod";

const aws_ses = _aws_ses.init(process.env as any);

const query_schema = z.object({
  username: z.string().nonempty(),
  email: z.string().email(),
  code: z.string().nonempty()
}).strict();

const user_schema = z.object({
  status: z.literal("Active"),
  resetPassword: z.object({code: z.string().nonempty()})
});

/**
 * Generate a new password for a given user
 * @param {Object} req query: Username, email, and reset password code generated in user model
 * @param {Object} res object to return response
 * @return {Promise} HTML for password reset message
 */
export default async function generateNewPassword (req: Request, res: Response){
  function fail() {
    return res.status(400).json("an error occurred");
  }

  const v = query_schema.safeParse(req.query);
  if(!v.success) return fail();

  const query = v.data;
  const user_result = await User.findOne({username: query.username, email: query.email}).then(ok=>({ok}), err=>({err}));
  if ("err" in user_result)                       return fail();
  if (!user_result.ok)                            return fail();

  const user = user_result.ok;
  if(!user_schema.safeParse(user).success)        return fail();
  if (query.code !== user.resetPassword.code)     return fail();

  // generate new random password
  const newPassword = user.generateNewPassword();
  user.setPassword(newPassword);

  const mailOpts = aws_ses.send_mail_opts({
    to: query.email,
    subject: 'New Password -- An Scéalaí',
    text: `Your An Scéalaí password has been reset.\nusername: ${req.query.username}\npassword: ${newPassword}`,
  });

  if(!mailOpts.success) return fail();
  // send email with new random password
  const mail_response = await aws_ses.send_mail_aws(mailOpts.data).then(ok=>({ok}), err=>({err}));
  if("err" in mail_response) return fail();

  const user_save_result = await user.save().then(ok=>({ok}), err=>({err}))
  if("err" in user_save_result) {
    console.error(new Error(), {mail_response, user_save_result});
    return res.send("<p>Failed to update user record. We have sent you an email with a new password, but we failed to update you record. This means the password we sent you will not work! Please try again.</p>");
  }

  return res.send(`<h1>Password reset successfully</h1><p>Please check your email (the email may end up in the spam folder).</p>`);
};