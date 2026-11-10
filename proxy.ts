import { NextRequest, NextResponse } from "next/server";
import { COOKIE, makeToken } from "@/lib/auth-token";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = req.cookies.get(COOKIE)?.value === makeToken();
  if (pathname === "/admin/login") return authed ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  if (authed) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*"] };
