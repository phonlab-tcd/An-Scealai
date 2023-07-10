import { Request, Response } from "express";


/**
 * Login users
 * @param {Object} req user object
 * @param {Object} res
 * @return {Object} generated JWT token or error messages
 */
export default function login(req: Request, res: Response) {
    // assume passport.authenticate('local') has succeeded,
    // which converts req.user to mongoose user object from front-end token
    if(!("user" in req)) {
        throw new Error("login handler called without user property set (no authentication)");
    }

    // @ts-ignore
    const user = req.user;
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
    // @ts-ignore
    if (!user.validStatus()) {
      // @ts-ignore
      console.error('User,' + user.username + 'has an invalid no status property');
      // @ts-ignore
      resObj.errors.push('Invalid status: ' + ( user.status ? user.status : undefined ));
      // @ts-ignore
      user.status = 'Pending';
      // @ts-ignore
      user.save().catch((err) => {
        console.error(err);
        resObj.errors.push(err);
      });
    }
  
    // send error if user has pending status and is not yet valid, otherwise login active user
    // @ts-ignore
    if (user.status === "Pending" || !user.email) {
      resObj.messageKeys.push('email_not_verified');
      // @ts-ignore
      resObj.userStatus = user.status;
      return res.status(400).json(resObj);
      // @ts-ignore
    } else if (user.status === "Active") {
      // @ts-ignore
      console.log('User ' + user.username + ' authenticated and status is Active. Sending json web token.');
      // @ts-ignore
      resObj.token = user.generateJwt();
      return res.status(200).json(resObj);
    }
  
    // ELSE
    // TODO throw new Error()
      // @ts-ignore
    console.error('User, ' + user.username + ' has an invalid status: ' + user.status + '. Should be Pending or Active.');
    return res.status(500).json(resObj);
  };