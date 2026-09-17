import * as Ably from "ably";
import { randomUUID } from "node:crypto";
import { isStoreAdmin } from "@backend/auth/role-service";
import { getCurrentUser } from "@/lib/auth-session";
import { REALTIME_CHANNELS } from "@/lib/realtime";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Mint short-lived, capability-limited Ably tokens without exposing the root API key to browsers.
export async function GET() {
  const key = process.env.ABLY_API_KEY;
  if (!key) return NextResponse.json({ error: "Realtime no está configurado." }, { status: 503, headers: { "Cache-Control": "no-store" } });

  try {
    const user = await getCurrentUser();
    const capabilities: Record<string, string[]> = { [REALTIME_CHANNELS.catalog]: ["subscribe"] };
    if (user && isStoreAdmin(user.role)) capabilities[REALTIME_CHANNELS.admin] = ["subscribe"];

    const tokenRequest = await new Ably.Rest({ key }).auth.createTokenRequest({
      clientId: user ? `user:${user.id}` : `guest:${randomUUID()}`,
      capability: JSON.stringify(capabilities),
      ttl: 60 * 60 * 1000,
    });
    return NextResponse.json(tokenRequest, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "No fue posible iniciar la conexión en vivo." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
