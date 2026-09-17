import type { AuthErrorCode } from "@backend/auth/auth-types";
import { AuthConfigurationError } from "@/lib/auth-data";
import type { ZodType } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { fail } from "@backend/http/api-response";

// Reject cross-origin state changes even though session cookies are also SameSite=Lax.
export function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV === "test";

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

// Parse JSON once and validate it before it reaches the authentication domain layer.
export async function readValidatedBody<T>(request: NextRequest, schema: ZodType<T>) {
  try {
    const payload: unknown = await request.json();
    return schema.safeParse(payload);
  } catch {
    return schema.safeParse(undefined);
  }
}

// Keep client-visible failures concise and prevent database or mail-provider details from leaking.
export function authError(status: number, code: AuthErrorCode, message: string) {
  return NextResponse.json(fail({ code, message }), { status, headers: { "Cache-Control": "no-store" } });
}

// Map expected configuration and transient service errors to safe, actionable API responses.
export function authServiceError(error: unknown) {
  if (error instanceof AuthConfigurationError) return authError(503, "AUTH_NOT_CONFIGURED", "El acceso aún no está disponible. Inténtalo más tarde.");
  return authError(503, "AUTH_UNAVAILABLE", "No pudimos procesar tu solicitud. Inténtalo más tarde.");
}
