import { NextRequest, NextResponse } from "next/server";
import { MockPaymentProvider } from "@backend/payments/mock-provider";
import { fail, ok } from "@backend/http/api-response";
import { REALTIME_CHANNELS } from "@/lib/realtime";
import { publishRealtimeEvent } from "@/lib/realtime-server";

// Verify the mock provider signature before accepting an event; persistence/idempotency is the next DB-backed phase.
export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("x-mock-signature") ?? "";
  try {
    const event = await new MockPaymentProvider().handleWebhook({ payload, signature });
    await publishRealtimeEvent(REALTIME_CHANNELS.admin, "payment.updated", { eventId: event.eventId, paymentId: event.paymentId, type: event.type, amount: event.amount, currency: "COP" });
    return NextResponse.json(ok({ received: true, event }));
  } catch {
    return NextResponse.json(fail({ code: "INVALID_WEBHOOK", message: "El webhook no superó la verificación." }), { status: 401 });
  }
}
