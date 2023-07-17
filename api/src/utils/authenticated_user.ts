import { Request } from "express";
export default function authenticated_user(req: Request) {
  return (req as any).user;
}