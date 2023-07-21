import sendVerificationEmail from "../../utils/sendVerificationEmail";
import is_valid_username from "../../utils/is_valid_username";
import User from "../../models/user";
import { z } from "zod";
import base_url from "../../utils/base_url";

// schema for body of post request
const user_register_schema = z.object({
    username: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().nonempty(),
    baseurl: z.string().url(),
}).strict();


const REGISTER_RESPONSE = {
    'username_password_and_email_required': 400,
    'username_no_special_chars': 400,
    'username_taken_msg': 409,
    'failed_to_send_email': 500,

} as const;

type RegisterResponse = keyof typeof REGISTER_RESPONSE;
 
/**
 * Register new users
 * @param {Object} req body: username, email, password, baseurl
 * @param {Object} res
 * @return {Promise} Success or error message
 */
export default async function (req, res) {

    console.log("USER REGISTER");
    const resObj: {messageKeys:RegisterResponse[], errors: any[]} = {
      messageKeys: [],
      errors: [],
    };

    req.body = base_url(req)

    const body_validation = user_register_schema.safeParse(req.body);
    if(! body_validation.success) {
        // REQUIREMENTS
        if (!req.body.username || !req.body.password || !req.body.email) {
            resObj.messageKeys.push('username_password_and_email_required');
            return res.status(400).json(resObj);
        }
    }


    if(! is_valid_username(req.body.username)) {
        const k = "username_no_special_chars";
        resObj.messageKeys.push(k);
        return res.status(REGISTER_RESPONSE[k]).json(resObj);
    }  
  
    // set new user properties and save user to the DB
    const user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.role = req.body.role;
  
    const save_result = await user.save().then(ok=>({ok}), err=>({err}));
    if("err" in save_result) {
        if(!save_result.err.code) {
            return res.status(500).json(resObj);
        }
        if(save_result.err.code === 11000) {
            const k = 'username_taken_msg';
            resObj.messageKeys.push(k);
            return res.status(REGISTER_RESPONSE[k]).json(resObj);
        }
        else return res.status(500).json(resObj);
    }
  
    // send verification email so new users can verify their accounts
    const send_mail_result = await sendVerificationEmail(
        user.username,
        req.body.password,
        user.email,
        req.body.baseurl,
        req.body.language || 'en',
    ).then(ok => ({ ok }), err => ({ err }));

    console.log(send_mail_result);

    if("err" in send_mail_result) {
        const k = "failed_to_send_email";
        const status: number = REGISTER_RESPONSE[k];
        resObj.messageKeys.push(k);
        res.status(status).json(resObj);


        // bale out, start user registration from beginning
        // @ts-ignore
        const delete_result = await User.deleteOne({_id: user._id}).then(ok=>({ok}), err=>({err}));
        if("err" in delete_result) {
            console.warn({
                message: "Failed to delete user record after email registration failed to send",
                err: delete_result.err,
            });
        }
        return;
    }
  
    return res.status(200).json(resObj);
  };