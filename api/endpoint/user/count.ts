import User from "../../models/user";
import { Request, Response } from "express";

export default async function count(req: Request, res: Response) {
  const total = await User.where({}).countDocuments();
  const student = await User.where({role: 'STUDENT'}).countDocuments();
  const teacher = await User.where({role: 'TEACHER'}).countDocuments();
  const admin = await User.where({role: 'ADMIN'}).countDocuments();
  return res.status(200).json({
    total: total,
    student: student,
    teacher: teacher,
    admin: admin,
  });
}