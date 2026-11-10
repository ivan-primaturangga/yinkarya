import { createHmac } from "node:crypto";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@yinkarya.demo";
export const COOKIE = "yk_session";
const SECRET = process.env.AUTH_SECRET || "yinkarya-demo-secret-change-me";

export const sign = (v: string) => createHmac("sha256", SECRET).update(v).digest("hex");
export const makeToken = () => `${ADMIN_EMAIL}.${sign(ADMIN_EMAIL)}`;
