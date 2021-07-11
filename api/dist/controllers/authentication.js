"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var logger = require('../logger.js');
var mail = require('../mail');
if (mail.couldNotCreate) {
    logger.error('Failed to create mail module in ./api/controllers/authentication.js');
}
// Used to generate confirmation code to confirm email address
var jwt = require('jsonwebtoken');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
var pendingRegEx = /^Pending$/;
var activeRegEx = /^Active$/;
module.exports.generateNewPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, new_password, mailRes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.username || !req.query.email || !req.query.code) {
                    return [2 /*return*/, res.status(400).json("Please provide username, email and code in url params!")];
                }
                return [4 /*yield*/, User.findOne({ username: req.query.username, email: req.query.email })
                        .catch(function (err) {
                        logger.error(err);
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json("Username and email not found.")];
                }
                if (!user.status || user.status !== 'Active') {
                    res.status(400).json('User status must be active to reset password');
                }
                if (!user.resetPassword || !user.resetPassword.code || req.query.code !== user.resetPassword.code) {
                    return [2 /*return*/, res.status(400).json("Codes do not match. Refusing to change password.")];
                }
                new_password = user.generateNewPassword();
                user.setPassword(new_password);
                user.save().catch(function (err) { logger.error(err); });
                mailObj = {
                    from: 'scealai.info@gmail.com',
                    recipients: req.query.email,
                    subject: 'New Password -- An Scéalaí',
                    body: "Your An Sc\u00E9ala\u00ED password has been reset.\nusername: " + req.query.username + "\npassword: " + new_password
                };
                mailRes = mail.sendEmail(mailObj);
                res.status(200).send("<h1>Password reset successfully</h1><ul><li>username:" + req.query.username + "</li><li>password:" + new_password + "</li></ul>");
                return [2 /*return*/];
        }
    });
}); };
module.exports.resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_1, resetPasswordLink, mailObj, sendEmailRes, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.username) {
                    return [2 /*return*/, res.status(400).json({
                            messageKeys: ["Please provide a username in the query parameters."],
                        })];
                }
                if (!req.body.baseurl) {
                    logger.warning("baseurl not provided. defaulting to dev server: http://localhost:4000/");
                    req.body.baseurl = 'http://localhost:4000/';
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User.findOne({ username: req.body.username })];
            case 2:
                user = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(400).json({
                        messageKeys: ["Could not find user with username: " + req.body.username],
                    })];
            case 4:
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            messageKeys: ['username_not_found'],
                        })];
                }
                if (!user.status
                    || user.status.match(pendingRegEx)
                    || !user.status.match(activeRegEx)
                    || !user.email) {
                    return [2 /*return*/, res.status(400).json({
                            messageKeys: ["user_not_verified_cannot_reset_password"],
                        })];
                }
                resetPasswordLink = user.generateResetPasswordLink(req.body.baseurl);
                // Update user's email and verification code on the db
                return [4 /*yield*/, user.save()
                        .catch(function (err) {
                        logger.error(err);
                    })];
            case 5:
                // Update user's email and verification code on the db
                _a.sent();
                mailObj = {
                    from: 'scealai.info@gmail.com',
                    recipients: [user.email],
                    subject: 'An Scéalaí account verification',
                    message: "Dear " + user.username + ",\n      Please use this link to generate a new password for your account:\n\n      " + resetPasswordLink + "\n\n      \n      Kindly,\n      \n      The An Sc\u00E9ala\u00ED team",
                };
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, mail.sendEmail(mailObj)];
            case 7:
                sendEmailRes = _a.sent();
                if (!sendEmailRes) {
                    return [2 /*return*/, res.status(500).json({
                            messageKeys: ["There seems to have been error while trying to send an email to " + user.email],
                        })];
                }
                if (sendEmailRes.rejected.length && sendEmailRes.rejected.length !== 0) {
                    return [2 /*return*/, res.status(500).json({
                            messageKeys: ["Failed to send verification email to " + sendEmailRes.rejected + "."],
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        messageKeys: ["email_sent"],
                        sentTo: user.email,
                    })];
            case 8:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        messageKeys: [err_2.message]
                    })];
            case 9: return [2 /*return*/];
        }
    });
}); };
function sendVerificationEmail(username, password, email, baseurl) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var user, activationLink, sendEmailErr, sendEmailRes, err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                logger.info("beginning sendVerificationEmail(" + username + ", password, " + email + ", " + baseurl + ")");
                                return [4 /*yield*/, User.findOne({ username: username })
                                        .catch(function (err) {
                                        logger.error(err);
                                        reject(err);
                                    })];
                            case 1:
                                user = _a.sent();
                                // Require valid password
                                if (!user.validPassword(password)) {
                                    logger.error('Invalid password');
                                    reject({
                                        messageToUser: 'INVALID PASSWORD'
                                    });
                                }
                                user.email = email;
                                activationLink = user
                                    .generateActivationLink(baseurl);
                                // Update user's email and verification code on the db
                                return [4 /*yield*/, user.save()
                                        .catch(function (err) {
                                        reject(err);
                                    })];
                            case 2:
                                // Update user's email and verification code on the db
                                _a.sent();
                                mailObj = {
                                    from: 'scealai.info@gmail.com',
                                    recipients: [email],
                                    subject: 'An Scéalaí account verification',
                                    message: "Dear " + user.username + ",\n      Please use this link to verify your email address for An Sc\u00E9ala\u00ED:\n\n      " + activationLink + "\n\n      Once you have verified your email you will be able to log in again.\n      \n      Kindly,\n      \n      The An Sc\u00E9ala\u00ED team",
                                };
                                sendEmailErr = null;
                                _a.label = 3;
                            case 3:
                                _a.trys.push([3, 5, , 6]);
                                return [4 /*yield*/, mail.sendEmail(mailObj)];
                            case 4:
                                sendEmailRes = _a.sent();
                                if (!sendEmailRes) {
                                    return [2 /*return*/, reject({
                                            status: 404,
                                            messageToUser: "It seems the verification email failed to send",
                                        })];
                                }
                                if (sendEmailRes.rejected.length && sendEmailRes.rejected.length !== 0) {
                                    return [2 /*return*/, reject({
                                            messageToUser: "Failed to send verification email to " + sendEmailRes.rejected + ".",
                                        })];
                                }
                                return [2 /*return*/, resolve({
                                        messageToUser: "A verification email has been sent to " + sendEmailRes.accepted + ".",
                                    })];
                            case 5:
                                err_3 = _a.sent();
                                logger.error({
                                    file: './api/controllers/authentication.js',
                                    functionName: 'sendVerificationEmail',
                                    error: err_3,
                                });
                                if (err_3.response) {
                                    console.log(err_3.response);
                                    return [2 /*return*/, reject({
                                            messageToUser: err_3.response,
                                        })];
                                }
                                return [2 /*return*/, reject(err_3)];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); })]; // end Promise constructor
        });
    });
} // end sendVerificationEmail
// Set a user's status to Active when they click on the activation link
module.exports.verify = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.username) {
                    return [2 /*return*/, res.status(400).json("username required to verify account email address")];
                }
                if (!req.query.email) {
                    return [2 /*return*/, res.status(400).json("email required to verify account email address")];
                }
                if (!req.query.verificationCode) {
                    return [2 /*return*/, res.status(400).json("verificationCode required to verify account email address")];
                }
                return [4 /*yield*/, User.findOne({ username: req.query.username, email: req.query.email })
                        .catch(function (err) {
                        logger.error({
                            error: err,
                            endpoint: '/user/verify'
                        });
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json("User with username: " + req.query.username + " and email: " + req.query.email + " does not exist.")];
                }
                if (!(user.verification.code === req.query.verificationCode)) return [3 /*break*/, 3];
                user.status = 'Active';
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res
                        .status(200)
                        .send('<h1>Success</h1><p>Your account has been verified.</p><ul>' +
                        ("<li>username: " + user.username + "</li>") +
                        ("<li>verified email: " + user.email + "</li>") +
                        '</ul><p>')];
            case 3:
                res.status(200).send('<h1>Sorry</h1><p>That didn\'t work.</p>');
                return [2 /*return*/];
        }
    });
}); };
module.exports.verifyOldAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resObj, user, err_4, mailRes, mailErr_1, error_1, messageKeys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                resObj = {
                    messageKeys: [],
                    errors: [],
                };
                // API CALL REQUIREMENTS
                if (!req.body.username || !req.body.email || !req.body.password) {
                    resObj.messageKeys.push('username_password_and_email_required');
                    return [2 /*return*/, res.status(400).json(resObj)];
                }
                if (!req.body.baseurl) {
                    logger.warning('baseurl not provided to verifyOldAccount. Defaulting to dev server: http://localhost:4000/');
                    req.body.baseurl = 'http://localhost:4000/';
                }
                logger.info('Beginning verification of ' + req.body.username);
                return [4 /*yield*/, User.findOne({ username: req.body.username })
                        .catch(function (error) {
                        return res.status(404).json({
                            messageKeys: ['There was an error while trying to find a user with username: ' +
                                    req.body.username],
                            error: error,
                        });
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(40).josn('User not found')];
                }
                if (!(user.status === 'Active')) return [3 /*break*/, 5];
                if (user.email) {
                    return [2 /*return*/, res
                            .status(400)
                            .json("User: " + user.username + " is already verified with                 the email address: " + user.email + ".                 If you think this is a mistake please                 let us know at scealai.info@gmail.com")];
                }
                // if !user.email && user.status === 'Active'
                logger.warning("User: " + user.usernam + " was Active but           had no assoctiated email address.           Resetting to Pending");
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                user.status = 'Pending';
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res
                        .status(500)
                        .json({
                        file: './api/controllers/authentication.js',
                        functionName: 'verifyOldAccount',
                        messageKeys: ['There was an error on our server. ' +
                                'We failed to update your status to Pending.'],
                    })];
            case 4:
                err_4 = _a.sent();
                logger.error({
                    endpoint: '/user/verifyOldAccount',
                    error: err_4,
                });
                return [3 /*break*/, 5];
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, sendVerificationEmail(req.body.username, req.body.password, req.body.email, req.body.baseurl)];
            case 6:
                mailRes = _a.sent();
                console.log('mailRes:', mailRes);
                // IF ALL GOES WELL
                return [2 /*return*/, res.status(200).json({
                        messageKeys: ['User activation pending. Please check your email inbox'],
                    })];
            case 7:
                mailErr_1 = _a.sent();
                console.dir(mailErr_1);
                logger.error('mailErr', mailErr_1);
                resObj.messageKeys.push('An error occurred while trying to send a verification email.');
                if (mailErr_1.messageToUser) {
                    resObj.messageKeys.push(mailErr_1.messageToUser);
                }
                return [2 /*return*/, res
                        .status(500)
                        .json(resObj)];
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                messageKeys = ['An unknown error occurred'];
                console.dir(error_1);
                if (error_1.messageToUser) {
                    messageKeys.push(error_1.messageToUser);
                }
                return [2 /*return*/, res
                        .status(500)
                        .json({ messageKeys: messageKeys,
                        file: '.api/controllers/authentication.js',
                        functionName: 'verifyOldAccount',
                        error: error_1,
                    })];
            case 10: return [2 /*return*/];
        }
    });
}); };
module.exports.register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resObj, user, err_5, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resObj = {
                    messageKeys: [],
                    errors: [],
                };
                // REQUIREMENTS
                if (!req.body.username || !req.body.password || !req.body.email) {
                    resObj.messageKeys.push("username_password_and_email_required");
                    return [2 /*return*/, res.status(400).json(resObj)];
                }
                if (!req.body.baseurl) {
                    logger.warning('Property basurl missing from registration request. Using default (dev server)');
                    req.body.baseurl = 'http://localhost:4000/';
                }
                user = new User();
                user.username = req.body.username;
                user.email = req.body.email;
                user.setPassword(req.body.password);
                user.role = req.body.role;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                resObj.errors.push(err_5);
                logger.error(err_5);
                if (err_5.code) {
                    logger.error("Mongo error. Error code: " + err_5.code);
                    if (err_5.code === 11000) {
                        return [2 /*return*/, res.status(400).json({
                                messageKey: "username_taken_msg"
                            })];
                    }
                }
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, sendVerificationEmail(user.username, req.body.password, user.email, req.body.baseurl)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_6 = _a.sent();
                resObj.errors.push(err_6.messageToUser);
                return [2 /*return*/, res.status(500).json(resObj)];
            case 7: return [2 /*return*/, res.status(200).json({
                    messageKey: 'verification_email_sent'
                })];
        }
    });
}); };
module.exports.login = function (req, res) {
    var resObj = {
        userStatus: null,
        messageKeys: [],
        errors: [],
    };
    if (!req.body.username || !req.body.password) {
        resObj.messageKeys.push('username_and_password_required');
        return res
            .status(400)
            .json(resObj);
    }
    // AUTHENTICATE
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            logger.error(err);
            resObj.errors.push(err);
        }
        if (!user) {
            resObj.messageKeys.push(info.message);
            return res.status(400).json(resObj);
        }
        if (!user.validStatus()) {
            logger.error('User,' + user.username + 'has an invalid no status property');
            resObj.errors.push('Invalid status: ' + (user.status ? user.status : undefined));
            user.status = 'Pending';
            user.save().catch(function (err) {
                logger.error(JSON.parse(JSON.stringify(err)));
                resObj.errors.push(JSON.stringify(err));
            });
        }
        console.log(user.status);
        if (user.status.match(pendingRegEx)) {
            resObj.messageKeys.push('email_not_verified');
            resObj.userStatus = user.status;
            return res.status(400).json(resObj);
        }
        else if (user.status.match(activeRegEx)) {
            logger.info('User ' + user.username + ' authenticated and status is Active. Sending json web token.');
            resObj.token = user.generateJwt();
            return res
                .status(200)
                .json(resObj);
        }
        // ELSE
        // TODO throw new Error()
        logger.error('User, ' + user.username + ' has an invalid status: ' + user.status + '. Should be Pending or Active.');
        return res.status(500).json(resObj);
    })(req, res);
    // DON'T PUT ANYTHING AFTER passport.authenticate CALLBACK
};
