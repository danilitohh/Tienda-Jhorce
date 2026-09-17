import { NextResponse } from "next/server";

// Health endpoint exposes only operational readiness signals, never secrets or connection strings.
export async function GET() {
  return NextResponse.json({ data: { status: "ok", service: "jhorce-store", timestamp: new Date().toISOString(), mongoConfigured: Boolean(process.env.MONGODB_URI), emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) }, error: null });
}
