import { z } from "zod";
const lang = z.enum(["en","ga"]);

export default async function getLanguage (req, res) {
  const language = lang.safeParse(req.user.language);
  if(!language.success) return res.status(500).json("no language code");
  return res.json({language: language.data});
}