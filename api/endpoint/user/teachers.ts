import User from "../../models/user";
import { Request, Response } from "express";
import { z } from "zod";

const authenticated_user_schema = z.object({
  role: z.literal("ADMIN"),
});

/**
 * Get all teacher users from the DB
 * @param {Object} req headers: user ID
 * @param {Object} res List of teachers
 */
export default async function teachers(req: Request, res: Response) {

  if (!("user" in req)) {
    return res.status(401).json("no authenticated user found");
  }

  const user = authenticated_user_schema.safeParse(req?.user);

  if (!user.success) {
    return res.status(401).json("user not authorized");
  }

  const user_result = User.find({ role: 'TEACHER' }).then(ok => ({ ok }), err => ({ err }));

  if ("err" in user_result) {
    return res.status(500).json("unexpected error");
  }

  if (!user_result.ok) {
    return res.status(404).json("none found");
  }

  return res.json(user_result.ok);
};