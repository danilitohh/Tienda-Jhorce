import { adminLoginSchema } from "@backend/auth/auth-validation";
import { ok } from "@backend/http/api-response";
import { getConfiguredAdminUsername, isAdminAuthConfigured, verifyAdminCredentials } from "@/lib/admin-config";
import { authError, authServiceError, hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { isMongoAuthConfigured } from "@/lib/auth-data";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, createAdminSession } from "@/lib/admin-session";
import { isAuthRateLimited } from "@/lib/auth-rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Authenticate the owner with private username/password credentials and issue a separate admin cookie.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");
  if (!isMongoAuthConfigured() || !isAdminAuthConfigured()) return authError(503, "AUTH_NOT_CONFIGURED", "El acceso administrativo aún no está configurado.");

  const parsed = await readValidatedBody(request, adminLoginSchema);
  if (!parsed.success) return authError(400, "INVALID_INPUT", "Revisa tu usuario y contraseña.");

  try {
    if (await isAuthRateLimited(request, "admin-login", parsed.data.username, [{ bucket: "ip", maxAttempts: 10, windowMs: 15 * 60 * 1000 }, { bucket: "account", maxAttempts: 8, windowMs: 15 * 60 * 1000 }])) return authError(429, "RATE_LIMITED", "Has realizado varios intentos. Inténtalo más tarde.");
    if (!verifyAdminCredentials(parsed.data.username, parsed.data.password)) return authError(401, "INVALID_CREDENTIALS", "Usuario o contraseña incorrectos.");

    const username = getConfiguredAdminUsername();
    if (!username) return authError(503, "AUTH_NOT_CONFIGURED", "El acceso administrativo aún no está configurado.");
    const sessionToken = await createAdminSession(username);
    const response = NextResponse.json(ok({ admin: { username } }), { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, adminSessionCookieOptions);
    return response;
  } catch (error) {
    return authServiceError(error);
  }
}
