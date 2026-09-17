import { signUpSchema } from "@backend/auth/auth-validation";
import { createAuthToken, createPendingUser, discardPendingUser } from "@/lib/auth-data";
import { sendVerificationEmail } from "@/lib/auth-email";
import { authError, authServiceError, hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { isAuthRateLimited } from "@/lib/auth-rate-limit";
import { ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Register a MongoDB-backed customer account and send its mandatory confirmation link.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  const parsed = await readValidatedBody(request, signUpSchema);
  if (!parsed.success) return authError(400, "INVALID_INPUT", "Revisa los datos de registro.");

  try {
    if (await isAuthRateLimited(request, "sign-up", parsed.data.email, [{ bucket: "ip", maxAttempts: 5, windowMs: 60 * 60 * 1000 }, { bucket: "account", maxAttempts: 3, windowMs: 60 * 60 * 1000 }])) return authError(429, "RATE_LIMITED", "Has realizado varios intentos. Inténtalo más tarde.");
    const result = await createPendingUser(parsed.data);
    if (!result.created) return NextResponse.json(ok({ message: "Si el correo puede registrarse, recibirás un mensaje para activar tu acceso." }), { status: 202, headers: { "Cache-Control": "no-store" } });

    const token = await createAuthToken(result.user.id, "email-verification");
    const delivery = await sendVerificationEmail({ email: result.user.email, firstName: result.user.firstName, token });
    if (delivery !== "sent") {
      await discardPendingUser(result.user.id);
      return authError(503, "EMAIL_DELIVERY_UNAVAILABLE", "No pudimos enviar el correo de confirmación. Inténtalo más tarde.");
    }

    return NextResponse.json(ok({ message: "Revisa tu correo para confirmar tu cuenta." }), { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return authServiceError(error);
  }
}
