import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ADMIN_EMAIL, COOKIE, makeToken } from "@/lib/auth-token";

// Demo-only credentials. Override with ADMIN_EMAIL / ADMIN_PASSWORD / AUTH_SECRET in production.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "YinKarya#2026";
const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function checkCredentials(email: string, password: string) {
  return safeEq(email.trim().toLowerCase(), ADMIN_EMAIL.toLowerCase()) && safeEq(password, ADMIN_PASSWORD);
}

export async function isAuthed() {
  const v = (await cookies()).get(COOKIE)?.value;
  return !!v && safeEq(v, makeToken());
}
