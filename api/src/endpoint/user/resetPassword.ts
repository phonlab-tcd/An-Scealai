import User from "../../models/user";
import * as _aws_ses from "../../utils/aws-ses-send-email";
import { z } from "zod";
import { ObjectId } from "mongodb";
import obscure_email_address from "../../utils/obscure_email_address";
import result from "../../utils/result";

const aws_ses = _aws_ses.init(process.env as any);

const reset_password_schema = z.object({
    username: z.string().nonempty(),
    baseurl: z.string().url(),
});

/**
 * Reset the password for a given user
 * @param {Object} req body: Username, baseUrl
 * @param {Object} res object to return response
 * @return {Promise} Success or error message
 */
export default async function (req, res) {

    const v = reset_password_schema.safeParse(req.body);

    if(!v.success) {
        console.warn(new Error("reset password body validation failed"), reset_password_schema)
        return res.status(400).json({
            messageKeys: ['invalid_body_post_request']
        });
    }

    req.body = v.data;

    // get user from DB by username
    const user_result = await result(User.findOne({username: req.body.username}));

    if ("err" in user_result) {
        console.warn(new Error("findOne failure searching for user"), user_result);
        return res.status(400).json({
            messageKeys: ['Error while searching for user with username: ' + req.body.username],
        });
    }

    const user = user_result.ok;
    if ( !user ) {
      console.warn(new Error("user not found"), user_result);
      return res.status(404).json({
        messageKeys: ['username_not_found'],
      });
    }

    // check user has certain properties set: an email, active or pending status
    if (! user.canResetPassword() ) {
      console.warn(new Error("user is not allowed to reset password"), user);
      return res.status(400).json({
        messageKeys: ['user_not_verified_cannot_reset_password'],
      });
    }

    // Generate a reset password link for the user
    const resetPasswordLink = user.generateResetPasswordLink(req.body.baseurl);

    const user_save = await result(user.save());

    if("err" in user_save) {
        console.warn(new Error("failed to save user's reset password link"), user_save);
        return res.status(400).json({
            messageKeys: ["Something went wrong. Password reset failed."]
        })
    }

    const mailOpts = aws_ses.send_mail_opts({
      to: user.email,
      subject: 'An Scéalaí account verification',
      text:
      `Dear ${user.username},\n\
        Please use this link to generate a new password for your account:\n\n\
        ${resetPasswordLink}\n\n\
        \n\
        Kindly,\n\
        \n\
        The An Scéalaí team`,
    });

    if(!mailOpts.success) {
        console.warn(new Error(mailOpts.error.toString()))
        return res.status(500).json({
            messageKeys: [`There was a fatal error. Unable to queue password reset email for email address: ${user.email}`]
        })
    }

    // make email private for display by replacing characters with stars ***
    let hiddenEmail: any = obscure_email_address(user.email);

    if ("err" in hiddenEmail) {
        hiddenEmail = "***";
    } else {
        hiddenEmail = hiddenEmail.ok;
    }

    // send the email
    const send_email_result = await result(aws_ses.send_mail_aws(mailOpts.data));

    if ("err" in send_email_result) {
      console.warn(new Error("Failed to send password reset email. Deleting user's resetPassword link."),)
      res.status(500).json({
        messageKeys: [`There seems to have been error while trying to send 
          an email to ${hiddenEmail}`],
      });
      user.resetPassword = null;
      await user.save()
    }

    return res.status(200).json({
      messageKeys: [`email_sent`],
      sentTo: hiddenEmail,
    });
  };