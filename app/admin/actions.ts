"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials } from "@/lib/auth";
import { COOKIE, makeToken } from "@/lib/auth-token";

export async function login(_: { error?: string } | undefined, fd: FormData) {
  const ok = checkCredentials(String(fd.get("email") ?? ""), String(fd.get("password") ?? ""));
  if (!ok) return { error: "Invalid email or password." };
  (await cookies()).set(COOKIE, makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
