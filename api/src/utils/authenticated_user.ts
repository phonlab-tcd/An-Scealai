import { Request } from "express";
export default function authenticated_user(req: Request) {
  const user = (req as any).user;
  if(!user) throw new Error("no authenticated user");
  return user;
}