import makeEndpoints from "../utils/makeEndpoints";
import passport from "passport";
import checkJwt from "../utils/jwtAuthMw";
import crypto from "node:crypto";
import User from "../models/user";

import register from "../endpoint/user/register";
import verifyOldAccount from "../endpoint/user/verifyOldAccount";
import login from "../endpoint/user/login";
import resetPassword from "../endpoint/user/resetPassword";
import generateNewPassword from "../endpoint/user/generateNewPassword";
import verify from "../endpoint/user/verify";
import viewUser from "../endpoint/user/viewUser";
import teachers from "../endpoint/user/teachers";
import getUserById from "../endpoint/user/getUserById";

import searchUser from "../endpoint/user/searchUser";
import count from "../endpoint/user/count";
import countAndStatus from "../endpoint/user/countAndStatus";
import deleteUser from "../endpoint/user/deleteUser";

import updateUsername from "../endpoint/user/updateUsername";
import countUsersWithStories from "../endpoint/user/countUsersWithStories";
import countTeachersWithClassrooms from "../endpoint/user/countTeachersWithClassrooms";
import getLanguageCount from "../endpoint/user/getLanguageCount";
import setLanguage from "../endpoint/user/setLanguage";
import getLanguage from "../endpoint/user/getLanguage";
import getUserByUsername from "../endpoint/user/getUserByUsername";
import updatePassword from "../endpoint/user/updatePassword";

export const userRoutes = makeEndpoints({
  get: {
    "/count": count,
    "/countAndStatus": countAndStatus,
    "/countUsersWithStories": countUsersWithStories,
    "/countTeachersWithClassrooms": countTeachersWithClassrooms,
    "/getLanguageCount": getLanguageCount,
    "/getLanguage/:id": [ checkJwt, getLanguage],
    "/generateNewPassword": [ generateNewPassword],
    "/verify": verify,
    "/viewUser": [ checkJwt, viewUser],
    "/teachers": [ checkJwt, teachers],

    "/getUserById/:id": [ checkJwt, getUserById],
    "/getUserByUsername/:username": [ checkJwt, getUserByUsername],
  },
  post: {
    "/searchUser": searchUser,
    "/updateUsername/:id": updateUsername,
    "/updatePassword": [checkJwt, updatePassword],
    "/register": register,
    "/login": [passport.authenticate("local"), login],
    "/verifyOldAccount": verifyOldAccount,
    "/resetPassword": resetPassword,
    "/setLanguage/:id": [checkJwt, setLanguage],
  },
});

export default userRoutes;
