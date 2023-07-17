import User from "../../models/user";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { z } from "zod";

function oid(i) {
    return new ObjectId(i);
}

const oid_schema = z.string().refine(oid);

const headers_schema = z.object({_id: oid_schema});
const user_schema = z.object({
    username: z.optional(z.string()),
    _id: oid_schema,
    role: z.optional(z.enum(["STUDENT", "TEACHER"])),
});


// requires user id in headers._id
// returns partial user object
export default async function viewUser(req: Request, res: Response) {
    const v = headers_schema.safeParse(req.headers);
    if(!v.success) {
        return res.status(400).json("headers._id bad format");
    }
    req.headers = v.data;

    const user_result = User.findById(req.headers._id).then(ok=>({ok}),err=>({err}))
    if("err" in user_result) {
        return res.status(500).json("an unexpected error occurred");
    }

    const user_v = user_schema.safeParse(user_result.ok);

    if(!user_v.success) {
        console.warn(new Error("fatal error in format of user"), user_v);
        return res.status(500).json({
            username: `FATAL ERROR PARSING USER DATA FOR USER: ${user_result.ok.username}`,
            _id: user_result.ok._id,
            role: user_result.ok.role,
        });
    }
    return res.status(200).json(user_v.data);
  };