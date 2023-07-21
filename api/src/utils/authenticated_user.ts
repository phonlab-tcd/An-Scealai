import { Request } from "express";
import { API500Error } from "./APIError";
export default function authenticated_user(req: Request) {
  const user = (req as any).user;
  if(!user) throw new API500Error("no authenticated user");
  return user;
}