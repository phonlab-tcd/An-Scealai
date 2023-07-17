import { z } from "zod";
export default function obscure_email_address(email: string) {
  const v = z.string().email().safeParse(email);
  if(!v.success) return {err: v.error};
  const [ local, domain ] = email.split("@");
  const obscured_email = local.slice(0,2) + "***" +  "@" + domain;
  return {ok: obscured_email};
}
