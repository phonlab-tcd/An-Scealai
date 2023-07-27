import { Request, Response } from "express";
import authenticated_user from "../../utils/authenticated_user";

export default function login(req: Request, res: Response) {
  // assume passport.authenticate('local') has succeeded,
  // which converts req.user to mongoose user object from front-end token
  const user = authenticated_user(req);
  console.log(user);

  const resObj: any =  {
    userStatus: null,
    messageKeys: [],
    errors: [],
    token: undefined,
  };

  // pretty sure this can never happen behind jwt auth middleware (neimhin 10/7/23)
  if (!user) {
    resObj.messageKeys.push("user_not_found");
    return res.status(404).json(resObj);
  }

  // send error if user has not been validated, set status to 'Pending'
  if (!user.validStatus()) {
    console.error('User,' + user.username + 'has an invalid no status property');
    resObj.errors.push('Invalid status: ' + ( user.status ? user.status : undefined ));
    user.status = 'Pending';
    user.save().catch((err) => {
      console.error(err);
      resObj.errors.push(err);
    });
  }

  // send error if user has pending status and is not yet valid, otherwise login active user
  if (user.status !== "Active" || !user.email) {
    console.error(new Error("user is not active"), user);
    resObj.messageKeys.push('email_not_verified');
    resObj.userStatus = user.status;
    return res.status(400).json(resObj);
  }
  
  console.log('User ' + user.username + ' authenticated and status is Active. Sending json web token.');
  resObj.token = user.generateJwt();
  return res.status(200).json(resObj);
};