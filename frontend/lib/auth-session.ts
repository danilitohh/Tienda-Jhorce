import { cookies } from "next/headers";
import type { AuthenticatedUser } from "@backend/auth/auth-types";
import { deleteSessionByToken, getUserFromSessionToken } from "@/lib/auth-data";

export const AUTH_SESSION_COOKIE = "byjhor_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

// Keep the bearer token inaccessible to JavaScript and constrained to same-site navigation.
export const authSessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

// Read the current request cookie and resolve it through MongoDB; failures intentionally behave as signed out.
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    return await getUserFromSessionToken(token);
  } catch {
    return null;
  }
}

// Revoke the server-side session before clearing the browser cookie during logout.
export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (token) await deleteSessionByToken(token);
}
