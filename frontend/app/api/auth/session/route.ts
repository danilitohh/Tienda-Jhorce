import { getCurrentUser } from "@/lib/auth-session";
import { ok } from "@backend/http/api-response";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Return the safe current-user projection so client navigation can adapt without exposing session tokens.
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(ok({ user }), { headers: { "Cache-Control": "private, no-store" } });
}
