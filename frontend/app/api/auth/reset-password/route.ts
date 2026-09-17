import { passwordResetSchema } from "@backend/auth/auth-validation";
import { resetPasswordWithToken } from "@/lib/auth-data";
import { authError, authServiceError, hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Consume a one-use recovery token, change the password and revoke every prior authenticated browser session.
export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return authError(403, "INVALID_INPUT", "No pudimos validar el origen de la solicitud.");

  const parsed = await readValidatedBody(request, passwordResetSchema);
  if (!parsed.success) return authError(400, "INVALID_INPUT", "La contraseña o el enlace no son válidos.");

  try {
    const changed = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    if (!changed) return authError(400, "INVALID_OR_EXPIRED_TOKEN", "Este enlace no es válido o ya venció. Solicita uno nuevo.");
    return NextResponse.json(ok({ message: "Tu contraseña fue actualizada. Ya puedes iniciar sesión." }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return authServiceError(error);
  }
}
