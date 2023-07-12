import makeEndpoints from "../utils/makeEndpoints";
import passport from "passport";
import checkJwt from "../utils/jwtAuthMw";
import crypto from "node:crypto";
import User from "../models/user";

import register from "../endpoints_functions/user/register";
import verifyOldAccount from "../endpoints_functions/user/verifyOldAccount";
import login from "../endpoints_functions/user/login";
import resetPassword from "../endpoints_functions/user/resetPassword";
import generateNewPassword from "../endpoints_functions/user/generateNewPassword";
import verify from "../endpoints_functions/user/verify";
import viewUser from "../endpoints_functions/user/viewUser";
import teachers from "../endpoints_functions/user/teachers";
import getUserById from "../endpoints_functions/user/getUserById";

import searchUser from "../endpoints_functions/user/searchUser";
import count from "../endpoints_functions/user/count";
import countAndStatus from "../endpoints_functions/user/countAndStatus";

import updateUsername from "../endpoints_functions/user/updateUsername";
import countUsersWithStories from "../endpoints_functions/user/countUsersWithStories";
import countTeachersWithClassrooms from "../endpoints_functions/user/countTeachersWithClassrooms";
import getLanguageCount from "../endpoints_functions/user/getLanguageCount";
import setLanguage from "../endpoints_functions/user/setLanguage";
import getLanguage from "../endpoints_functions/user/getLanguage";
import getUserByUsername from "../endpoints_functions/user/getUserByUsername";

export const userRoutes = makeEndpoints({
  get: {
    "/count": count,
    "/countAndStatus": countAndStatus,
    "/countUsersWithStories": countUsersWithStories,
    "/countTeachersWithClassrooms": countTeachersWithClassrooms,
    "/getLanguageCount": getLanguageCount,
  },
  post: {
    "/searchUser": searchUser,
    "/updateUsername/:id": updateUsername,
  },
});

userRoutes.post("/register", register);
userRoutes.post("/login", passport.authenticate("local"), login);
userRoutes.post("/verifyOldAccount", verifyOldAccount);
userRoutes.post("/resetPassword", resetPassword);


userRoutes.post("/setLanguage/:id", checkJwt, setLanguage);

userRoutes.get("/getLanguage/:id", checkJwt, getLanguage);
userRoutes.get("/generateNewPassword", generateNewPassword);
userRoutes.get("/verify", verify);
userRoutes.get("/viewUser", checkJwt, viewUser);
userRoutes.get("/teachers", checkJwt, teachers);

userRoutes.get("/getUserById/:id", checkJwt, getUserById);
userRoutes.get("/getUserByUsername/:username", checkJwt, getUserByUsername);

/**
 * Delete user by ID
 * @param {Object} req params: User ID
 * @return {Object} Success or error message
 */
userRoutes.route("/deleteUser/:id").get(function(req, res) {
  User.findOneAndRemove({_id: req.params.id}, function(err, user) {
    if (err) {
      console.log(err);
      res.send(err);
    } else res.json("Successfully removed user");
  });
});


/**
 * Update user password -- DEPRICATED?
 * @param {Object} req params: Student ID
 * @return {Object} Success or error message
 */
userRoutes.route("/updatePassword/:id").post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (user) {
      user.salt = crypto.randomBytes(16).toString("hex");
      user.hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, "sha512").toString("hex");
      user.save().then(() => {
        res.status(200).json("Password updated successfully");
      }).catch((err) => {
        res.status(500).send(err);
      });
    } else {
      res.status(404).send(`User with _id ${req.params.id} could not be found`);
    }
  });
});

export default userRoutes;
