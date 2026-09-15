import { NextResponse } from "next/server";

// Health endpoint exposes only operational readiness signals, never secrets or connection strings.
export async function GET() {
  return NextResponse.json({ data: { status: "ok", service: "jhorce-store", timestamp: new Date().toISOString(), supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) }, error: null });
}

