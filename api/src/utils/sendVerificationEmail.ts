import * as aws_ses from "./aws-ses-send-email";
import User from "../models/user";

function createMessage(language: "en" | "ga", username: string, activationLink) {
    return (language === 'ga') ?
        // as gaeilge
        `A ${username}, a chara,\n\
    Úsáid an nasc seo a leanas chun do sheoladh rphoist a dheimhniú, le do thoil:\n\n\
    ${activationLink}\n\n\
    A luaithe is a dheimhníonn tú do sheoladh rphoist beidh tú in ann logáil isteach arís.\n\
    \n\
    Le gach dea-ghuí,\n\
    \n\
    Foireann An Scéalaí` :
        // in english
        `Dear ${username},\n\
    Please use this link to verify your email address for An Scéalaí:\n\n\
    ${activationLink}\n\n\
    Once you have verified your email you will be able to log in again.\n\
    \n\
    Kindly,\n\
    \n\
    The An Scéalaí team`;

}

/**
 * Send verification email for new user to set up their account
 * @param {Object} username
 * @param {Object} password
 * @param {Object} email
 * @param {Object} baseurl
 * @param {Object} language
 * @return {Promise} Success or error message after sending email
 */
export default async function sendVerificationEmail(username, password, email, baseurl, language: "ga" | "en") {
    // Get User from DB by username and email
    const user = await User.findOne({ username, email })

    // Check if user has a valid password
    if (!user.validPassword(password)) {
        console.error('Invalid password');
        throw { messageToUser: 'INVALID PASSWORD' };
    }

    user.email = email;

    // Update user's email and verification code on the db
    const activationLink = user.generateActivationLink(baseurl, language);

    await user.save()

    const emailMessage = createMessage(language, user.username, activationLink);

    const mailOpts = aws_ses.send_mail_opts({
        to: email,
        subject: 'An Scéalaí account verification',
        text: emailMessage,
    });

    if (!mailOpts.success) throw (mailOpts.error);

    const send_mail_result = await aws_ses.send_mail_aws(mailOpts.data).then(ok => ({ ok }), err => ({ err }));

    if ("err" in send_mail_result) {
        console.error(send_mail_result);
        throw { status: 500, messageToUser: "It seems the verification email failed to send." };
    }

    return {
        messageToUser: `A verification email has been sent to ${email}.`,
        messageId: send_mail_result.ok.MessageId,
    };
}