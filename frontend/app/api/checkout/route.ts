import { NextRequest, NextResponse } from "next/server";
import { createMockCheckout } from "@backend/checkout/checkout-service";
import { fail, ok } from "@backend/http/api-response";

// Create a server-recalculated mock checkout preview and return stable validation errors.
export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    const preview = await createMockCheckout(input);
    return NextResponse.json(ok(preview), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible preparar el checkout.";
    const isValidationError = error instanceof Error && error.name === "ZodError";
    return NextResponse.json(fail({ code: isValidationError ? "INVALID_CHECKOUT" : "CHECKOUT_ERROR", message: isValidationError ? "Revisa los datos del checkout." : message }), { status: isValidationError ? 400 : 422 });
  }
}

