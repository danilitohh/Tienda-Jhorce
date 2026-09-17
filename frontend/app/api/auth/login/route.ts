import { loginSchema } from "@backend/auth/auth-validation";
import { authenticateUser, createSession } from "@/lib/auth-data";
import { authSessionCookieOptions, AUTH_SESSION_COOKIE } from "@/lib/auth-session";
import { authError, authServiceError, hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { isAuthRateLimited } from "@/lib/auth-rate-limit";
import { ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Verify MongoDB credentials, then issue an HttpOnly server-managed session cookie.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  const parsed = await readValidatedBody(request, loginSchema);
  if (!parsed.success) return authError(400, "INVALID_INPUT", "Revisa tu correo y contraseña.");

  try {
    if (await isAuthRateLimited(request, "login", parsed.data.email, [{ bucket: "ip", maxAttempts: 15, windowMs: 15 * 60 * 1000 }, { bucket: "account", maxAttempts: 8, windowMs: 15 * 60 * 1000 }])) return authError(429, "RATE_LIMITED", "Has realizado varios intentos. Inténtalo más tarde.");
    const result = await authenticateUser(parsed.data.email, parsed.data.password);
    if (result.state === "invalid") return authError(401, "INVALID_CREDENTIALS", "Correo o contraseña incorrectos.");
    if (result.state === "unverified") return authError(403, "EMAIL_NOT_VERIFIED", "Confirma tu correo antes de iniciar sesión.");

    const sessionToken = await createSession(result.user.id);
    const response = NextResponse.json(ok({ user: result.user }), { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, authSessionCookieOptions);
    return response;
  } catch (error) {
    return authServiceError(error);
  }
}
