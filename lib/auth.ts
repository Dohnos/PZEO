import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/crypto";

export const ADMIN_COOKIE = "pz_admin";
export const CLIENT_COOKIE = "pz_klient";
const WEEK = 7 * 24 * 60 * 60 * 1000;

export async function isAdmin() {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value)?.role === "admin";
}

export async function getClientId() {
  const store = await cookies();
  const p = verifyToken(store.get(CLIENT_COOKIE)?.value);
  return p?.role === "client" ? p.id : null;
}

export function setSession(res: NextResponse, name: string, role: "admin" | "client", id: string) {
  res.cookies.set(name, signToken({ role, id, exp: Date.now() + WEEK }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WEEK / 1000,
  });
}

export function clearSession(res: NextResponse, name: string) {
  res.cookies.set(name, "", { httpOnly: true, path: "/", maxAge: 0 });
}
