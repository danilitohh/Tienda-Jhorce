import { fail, ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";
import { importInitialCatalog } from "@/lib/admin-data";
import { adminDataError, requireAdminSession } from "@/lib/admin-route";
import { hasTrustedOrigin } from "@/lib/auth-route";
import { publishRealtimeEvent } from "@/lib/realtime-server";
import { REALTIME_CHANNELS } from "@/lib/realtime";

export const runtime = "nodejs";

// Import the current local assortment only after the private owner session and request origin are verified.
export async function POST(request: NextRequest) {
  const access = await requireAdminSession();
  if (access.response) return access.response;
  if (!hasTrustedOrigin(request)) return NextResponse.json(fail({ code: "INVALID_ORIGIN", message: "No pudimos validar el origen de la solicitud." }), { status: 403 });

  try {
    const result = await importInitialCatalog();
    if (result.imported > 0) await publishRealtimeEvent(REALTIME_CHANNELS.catalog, "catalog.updated", { action: "imported", imported: result.imported });
    return NextResponse.json(ok(result), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return adminDataError(error); }
}
