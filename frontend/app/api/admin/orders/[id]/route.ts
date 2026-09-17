import { adminOrderStatusSchema } from "@backend/validation/admin";
import { fail, ok } from "@backend/http/api-response";
import { NextRequest, NextResponse } from "next/server";
import { updateAdminOrderStatus } from "@/lib/admin-data";
import { adminDataError, requireAdminSession } from "@/lib/admin-route";
import { hasTrustedOrigin, readValidatedBody } from "@/lib/auth-route";
import { publishRealtimeEvent } from "@/lib/realtime-server";
import { REALTIME_CHANNELS } from "@/lib/realtime";

export const runtime = "nodejs";

// Move an order through its operational lifecycle using a server-validated admin status.
export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/orders/[id]">) {
  const access = await requireAdminSession();
  if (access.response) return access.response;
  if (!hasTrustedOrigin(request)) return NextResponse.json(fail({ code: "INVALID_ORIGIN", message: "No pudimos validar el origen de la solicitud." }), { status: 403 });
  const parsed = await readValidatedBody(request, adminOrderStatusSchema);
  if (!parsed.success) return NextResponse.json(fail({ code: "INVALID_ORDER", message: "El estado del pedido no es válido.", details: parsed.error.flatten() }), { status: 400 });
  try {
    const order = await updateAdminOrderStatus((await context.params).id, parsed.data.status, parsed.data.note, access.session.username);
    await publishRealtimeEvent(REALTIME_CHANNELS.admin, "order.updated", { orderId: order.id, status: order.status });
    return NextResponse.json(ok({ order }), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return adminDataError(error); }
}
