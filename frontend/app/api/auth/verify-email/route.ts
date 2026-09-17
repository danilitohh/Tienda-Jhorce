import { emailVerificationSchema } from "@backend/auth/auth-validation";
import { verifyEmailToken } from "@/lib/auth-data";
import { authError, authServiceError, hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Confirm a customer email once; the configured owner receives the sole admin role only at this boundary.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  const parsed = await readValidatedBody(request, emailVerificationSchema);
  if (!parsed.success) return authError(400, "INVALID_INPUT", "El enlace de confirmación no es válido.");

  try {
    const user = await verifyEmailToken(parsed.data.token);
    if (!user) return authError(400, "INVALID_OR_EXPIRED_TOKEN", "Este enlace no es válido o ya venció. Regístrate de nuevo.");
    return NextResponse.json(ok({ user, message: "Tu cuenta fue confirmada." }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return authServiceError(error);
  }
}
