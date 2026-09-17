import { adminProductUpdateSchema } from "@backend/validation/admin";
import { fail, ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";
import { updateAdminProduct } from "@/lib/admin-data";
import { adminDataError, requireAdminSession } from "@/lib/admin-route";
import { hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { publishRealtimeEvent } from "@/lib/realtime-server";
import { REALTIME_CHANNELS } from "@/lib/realtime";

export const runtime = "nodejs";

// Update a product by its stable public/admin identifier without allowing client-controlled Mongo fields.
export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  const access = await requireAdminSession();
  if (access.response) return access.response;
  if (!hasTrustedOrigin(request)) return NextResponse.json(fail({ code: "INVALID_ORIGIN", message: "No pudimos validar el origen de la solicitud." }), { status: 403 });
  const parsed = await readValidatedBody(request, adminProductUpdateSchema);
  if (!parsed.success) return NextResponse.json(fail({ code: "INVALID_PRODUCT", message: "Revisa los datos del producto.", details: parsed.error.flatten() }), { status: 400 });
  try {
    const product = await updateAdminProduct((await context.params).id, parsed.data);
    await publishRealtimeEvent(REALTIME_CHANNELS.catalog, "catalog.updated", { productId: product.id, action: "updated" });
    return NextResponse.json(ok({ product }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return adminDataError(error); }
}
