"use strict";
// user.route.js 
//
// endpoint prefix = '/user'
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
var logger = require('../logger');
var generator = require('generate-password');
var mail = require('../mail');
if (mail.couldNotCreate) {
    logger.info("Could not create mail transporter which is required by the user route. Refusing to continue.");
    process.exit(1);
}
var crypto = require('crypto');
var express = require('express');
var userRoutes = express.Router();
var jwt = require('express-jwt');
var User = require('../models/user');
var auth = jwt({
    secret: 'sonJJxVqRC',
    userProperty: 'payload'
});
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
userRoutes.get('/profile', auth, ctrlProfile.profileRead);
userRoutes.get('/viewUser', ctrlProfile.viewUser);
userRoutes.get('/teachers', ctrlProfile.getTeachers);
userRoutes.post('/register', ctrlAuth.register);
userRoutes.post('/login', ctrlAuth.login);
userRoutes.get('/verify', ctrlAuth.verify);
userRoutes.post('/verifyOldAccount', ctrlAuth.verifyOldAccount);
userRoutes.post('/resetPassword', ctrlAuth.resetPassword);
userRoutes.get('/generateNewPassword', ctrlAuth.generateNewPassword);
userRoutes.route('/setLanguage/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (user) {
            user.language = req.body.language;
            user.save().then(function () {
                res.status(200).json("Language set successfully");
            }).catch(function (err) {
                console.log(err);
                res.status(400).send(err);
            });
        }
    });
});
userRoutes.route('/getLanguage/:id').get(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (user) {
            res.json({ "language": user.language });
        }
        else {
            res.status(404).json("User not found");
        }
    });
});
userRoutes.route('/getUserByUsername/:username').get(function (req, res) {
    User.find({ "username": req.params.username }, function (err, user) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json("User not found");
        }
    });
});
// Endpoint to get all users from database
userRoutes.route('/getAllUsers').get(function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (users) {
            res.json(users);
        }
        else {
            res.status(404).json("No users exist on the database");
        }
    });
});
// Delete user by username
userRoutes.route('/deleteUser/:username').get(function (req, res) {
    User.findOneAndRemove({ "username": req.params.username }, function (err, user) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else
            res.json("Successfully removed user");
    });
});
var validUsernameRegEx = /^[a-z0-9]+$/i;
// Update username by id
userRoutes.route('/updateUsername/:id').post(function (req, res) {
    if (!req.body.username) {
        return res.status(400).send('req.body.username is required');
    }
    if (!req.body.username.match(validUsernameRegEx)) {
        return res.status(400).send(req.body.username + " is an invalide username." +
            "Valid characters are: a-z, A-Z, 0-9");
    }
    console.log(req.body.username);
    // Validate Username
    User.findById(req.params.id, function (err, user) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        logger.error(err);
                        return [2 /*return*/, res.status(500).send(err)];
                    }
                    if (!user) return [3 /*break*/, 5];
                    user.username = req.body.username;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent(); // .then(() => {
                    return [2 /*return*/, res.status(200).json('Username updated successfully')];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, res.status(500).send(err_1)];
                case 4: return [3 /*break*/, 6];
                case 5: return [2 /*return*/, res
                        .status(404)
                        .send("User with _id " + req.params.id + " could not be found")];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
// Update password by id 
userRoutes.route('/updatePassword/:id').post(function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (user) {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, 'sha512').toString('hex');
            user.save().then(function () {
                res.status(200).json("Password updated successfully");
            }).catch(function (err) {
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send("User with _id " + req.params.id + " could not be found");
        }
    });
});
// Update account with random password, send user an email
userRoutes.route('/sendNewPassword/').post(function (req, res) {
    User.findOne({ "username": req.body.username }, function (err, user) {
        if (err) {
            return res.status(500).json(err);
        }
        if (user) {
            var randomPassword = generator.generate({
                length: 10,
                numbers: true
            });
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hash = crypto.pbkdf2Sync(randomPassword, user.salt, 1000, 64, 'sha512').toString('hex');
            console.log("change password to: ", randomPassword);
            user.save().then(function () {
                //console.log("Constructing the mailObj");
                var mailObj = {
                    from: "scealai.info@gmail.com",
                    recipients: [req.body.email],
                    subject: 'Update Password -- An Scéalaí',
                    message: "Hello " + req.body.username + ",\nYour An Sc\u00E9ala\u00ED password has been updated to:\n" + randomPassword, // TODO ask the user to change their password again
                };
                mail.sendEmail(mailObj).then(function (nodemailerRes) {
                    logger.info(nodemailerRes);
                    res.status(200).json("Password updated successfully");
                }).catch(function (err) {
                    logger.error(err);
                    res.status(500);
                });
            }).catch(function (err) {
                res.status(500).json(err);
            });
        }
        else {
            res.status(404).json("User with _id " + req.params.id + " could not be found");
        }
    });
});
module.exports = userRoutes;
