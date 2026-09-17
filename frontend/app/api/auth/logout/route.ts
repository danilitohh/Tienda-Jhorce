import { authSessionCookieOptions, AUTH_SESSION_COOKIE, revokeCurrentSession } from "@/lib/auth-session";
import { authError, authServiceError, hasTrustedOrigin } from "@/lib/auth-route";
import { ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Revoke the matching MongoDB session and expire the browser cookie in one response.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  try {
    await revokeCurrentSession();
    const response = NextResponse.json(ok({ signedOut: true }), { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(AUTH_SESSION_COOKIE, "", { ...authSessionCookieOptions, maxAge: 0 });
    return response;
  } catch (error) {
    return authServiceError(error);
  }
}
