import { adminProductCreateSchema } from "@backend/validation/admin";
import { fail, ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";
import { createAdminProduct, listAdminProducts } from "@/lib/admin-data";
import { adminDataError, requireAdminSession } from "@/lib/admin-route";
import { hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { publishRealtimeEvent } from "@/lib/realtime-server";
import { REALTIME_CHANNELS } from "@/lib/realtime";

export const runtime = "nodejs";

// Return the complete manageable catalog only after the separate admin session is verified.
export async function GET() {
  const access = await requireAdminSession();
  if (access.response) return access.response;
  try { return NextResponse.json(ok({ products: await listAdminProducts() }), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return adminDataError(error); }
}

// Create a draft or published product from the validated owner form and announce it after persistence.
export async function POST(request: NextRequest) {
  const access = await requireAdminSession();
  if (access.response) return access.response;
  if (!hasTrustedOrigin(request)) return NextResponse.json(fail({ code: "INVALID_ORIGIN", message: "No pudimos validar el origen de la solicitud." }), { status: 403 });
  const parsed = await readValidatedBody(request, adminProductCreateSchema);
  if (!parsed.success) return NextResponse.json(fail({ code: "INVALID_PRODUCT", message: "Revisa los datos del producto.", details: parsed.error.flatten() }), { status: 400 });
  try {
    const product = await createAdminProduct(parsed.data);
    await publishRealtimeEvent(REALTIME_CHANNELS.catalog, "catalog.updated", { productId: product.id, action: "created" });
    return NextResponse.json(ok({ product }), { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return adminDataError(error); }
}
