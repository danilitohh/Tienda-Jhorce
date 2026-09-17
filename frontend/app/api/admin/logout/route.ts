import { ok } from "@backend/http/api-response";
import { authError, hasTrustedOrigin } from "@/lib/auth-route";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, revokeCurrentAdminSession } from "@/lib/admin-session";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Revoke the owner session and clear the HttpOnly browser cookie without touching customer sessions.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  const revoked = await revokeCurrentAdminSession();
  if (!revoked) return authError(503, "AUTH_UNAVAILABLE", "No pudimos cerrar la sesión. Inténtalo de nuevo.");
  const response = NextResponse.json(ok({ loggedOut: true }), { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminSessionCookieOptions, maxAge: 0 });
  return response;
}
