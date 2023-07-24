import { z } from "zod";

const valid_username = z.string().regex(/^[a-z0-9]+$/i);

export default function is_valid_username(username: string): boolean {
    return valid_username.safeParse(username).success;
}