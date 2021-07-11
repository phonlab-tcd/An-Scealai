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
var nodemailer = require("nodemailer");
// Much of the following code was taken from this tutorial:
// https://schadokar.dev/posts/how-to-send-email-in-nodejs/
/**
 * sendEmail
 * @param {Object} mailObj - Email meta data and body
 * @param {String} from - Email address of the sender
 * @param {Array} recipients - Array of recipients email address
 * @param {String} subject - Subject of the email
 * @param {String} message - message
 */
var path = require('path');
var fs = require('fs');
module.exports.sendEmail = "not yet created";
try {
    console.log("Attempting to read sendinblue auth data from ./api/sendinblue.json");
    var rawdata = fs.readFileSync(path.join(__dirname, 'sendinblue.json'));
    var sendinblueData_1 = JSON.parse(rawdata);
    var sendEmail = function (mailObj) { return __awaiter(void 0, void 0, void 0, function () {
        var from, recipients, subject, message, transporter, mailStatus, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = mailObj.from, recipients = mailObj.recipients, subject = mailObj.subject, message = mailObj.message;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    transporter = nodemailer.createTransport({
                        host: "smtp-relay.sendinblue.com",
                        port: 587,
                        auth: {
                            user: sendinblueData_1.user,
                            pass: sendinblueData_1.pass,
                        },
                    });
                    return [4 /*yield*/, transporter.sendMail({
                            from: from,
                            to: recipients,
                            subject: subject,
                            text: message,
                        })];
                case 2:
                    mailStatus = _a.sent();
                    return [2 /*return*/, mailStatus];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    module.exports.sendEmail = sendEmail;
}
catch (err) {
    console.error("Failed to create email transport in ./api/mail.js. Have you created sendinblue.json ?");
    console.error(err);
    module.exports.sendEmail = null;
    module.exports.couldNotCreate = true;
}
/* EXAMPLE OF HOW TO USE THE sendEmail function
const mailObj = {
  from: "nrobinso@tcd.ie",
  recipients: ["scealai.info@gmail.com"],
  subject: "TEST 2 -- With passwords hidden -- This was send by nodejs",
  message: "Hi everybody!",
};

sendEmail(mailObj).then((res) => {
  console.log(res);
});
*/
