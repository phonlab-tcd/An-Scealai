import sendVerificationEmail from "../../utils/sendVerificationEmail";
import User from "../../models/user";

/**
 * Verify older accounts in the DB that did not have email verification upon registration
 * @param {Object} req query: username, email, password
 * @param {Object} res
 * @return {Promise} Success or error message
 */
export default async function verifyOldAccount(req, res) {
    const resObj: any = {
        messageKeys: [],
        errors: [],
    };
    // API CALL REQUIREMENTS
    if (!req.body.username || !req.body.email || !req.body.password) {
        resObj.messageKeys.push(
            'username_password_and_email_required',
        );
        return res.status(400).json(resObj);
    }
    if (!req.body.baseurl) {
        console.warn('baseurl not provided to verifyOldAccount. Defaulting to dev server: http://localhost:4000/');
        req.body.baseurl = 'http://localhost:4000/';
    }

    console.log('Beginning verification of ' + req.body.username);

    // get user from DB by username
    const find_user_result = await User.findOne({ username: req.body.username }).then(ok => ({ ok }), err => ({ err }))

    if ("err" in find_user_result) {
        return res.status(500).json('Unexpected error');
    }

    const user = find_user_result.ok;

    if (!user) {
        return res.status(404).json("user not found");
    }

    if (user.status === 'Active' && user.email) {
        // if user has already been verified
        return res.status(400).json(
            `User: ${user.username} is already verified with \
                  the email address: ${user.email}. \
                  If you think this is a mistake please \
                  let us know at scealai.info@gmail.com`);
    }

    if(!user.email) {
        user.email = req.body.email;
        user.status = "Pending";
        await user.save();
    }

    // send the verification email if no errors above have been sent
    const send_mail_result =
        await sendVerificationEmail(
            user.username,
            req.body.password,
            req.body.email,
            req.body.baseurl,
            req.body.language,
        ).then(ok => ({ ok }), err => ({ err }));

    if ("err" in send_mail_result) {
        resObj.messageKeys.push('An error occurred while trying to send a verification email.');
        if (send_mail_result.err.messageToUser) {
            resObj.messageKeys.push(send_mail_result.err.messageToUser);
        }
        return res.status(500).json(resObj);
    }


    // IF ALL GOES WELL
    return res.status(200).json({
        messageKeys: ['User activation pending. Please check your email inbox'],
    });
};