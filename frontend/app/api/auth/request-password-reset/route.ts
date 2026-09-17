import { recoveryRequestSchema } from "@backend/auth/auth-validation";
import { createAuthToken, findUserByEmail } from "@/lib/auth-data";
import { sendPasswordResetEmail } from "@/lib/auth-email";
import { authError, authServiceError, hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { isAuthRateLimited } from "@/lib/auth-rate-limit";
import { ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Start a recovery flow with a generic success response so the endpoint does not enumerate customers.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  const parsed = await readValidatedBody(request, recoveryRequestSchema);
  if (!parsed.success) return authError(400, "INVALID_INPUT", "Ingresa un correo electrónico válido.");

  try {
    if (await isAuthRateLimited(request, "password-reset", parsed.data.email, [{ bucket: "ip", maxAttempts: 10, windowMs: 15 * 60 * 1000 }, { bucket: "account", maxAttempts: 3, windowMs: 60 * 60 * 1000 }])) return authError(429, "RATE_LIMITED", "Has realizado varias solicitudes. Inténtalo más tarde.");
    const user = await findUserByEmail(parsed.data.email);
    if (user?.emailVerifiedAt) {
      const token = await createAuthToken(user.id, "password-reset");
      const delivery = await sendPasswordResetEmail({ email: user.email, firstName: user.firstName, token });
      if (delivery !== "sent") return authError(503, "EMAIL_DELIVERY_UNAVAILABLE", "No pudimos enviar el correo de recuperación. Inténtalo más tarde.");
    }

    return NextResponse.json(ok({ message: "Si el correo existe, recibirás un enlace para recuperar tu contraseña." }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return authServiceError(error);
  }
}
