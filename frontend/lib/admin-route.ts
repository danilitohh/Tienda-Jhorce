import { fail } from "@backend/http/api-response";
import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/admin-session";

// Resolve the separate admin session consistently for every protected operational endpoint.
export async function requireAdminSession() {
  const session = await getCurrentAdminSession();
  if (session) return { session, response: null } as const;
  return { session: null, response: NextResponse.json(fail({ code: "ADMIN_UNAUTHORIZED", message: "Tu sesión administrativa no está activa." }), { status: 401, headers: { "Cache-Control": "no-store" } }) } as const;
}

// Convert expected persistence failures into stable responses without leaking MongoDB internals.
export function adminDataError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? Reflect.get(error, "code") : null;
  if (code === "NOT_FOUND") return NextResponse.json(fail({ code, message: "El registro ya no está disponible." }), { status: 404 });
  if (code === "CONFLICT") return NextResponse.json(fail({ code, message: error instanceof Error ? error.message : "El registro ya existe." }), { status: 409 });
  return NextResponse.json(fail({ code: "ADMIN_DATA_UNAVAILABLE", message: "No fue posible guardar el cambio. Inténtalo de nuevo." }), { status: 503, headers: { "Cache-Control": "no-store" } });
}
