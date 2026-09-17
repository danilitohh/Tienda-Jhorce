import { NextRequest, NextResponse } from "next/server";
import { catalogQuerySchema } from "@backend/validation/catalog";
import { fail, ok } from "@backend/http/api-response";
import { listStoreProducts } from "@/lib/catalog-repository";

// Serve catalog reads through a validated query boundary that can later switch to Prisma.
export async function GET(request: NextRequest) {
  const parsed = catalogQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) return NextResponse.json(fail({ code: "INVALID_QUERY", message: "Los filtros no son válidos.", details: parsed.error.flatten() }), { status: 400 });
  return NextResponse.json(ok(await listStoreProducts({ query: parsed.data.q, category: parsed.data.category, sort: parsed.data.sort })), { headers: { "Cache-Control": "no-store" } });
}
