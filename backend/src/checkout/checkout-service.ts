import { randomUUID } from "node:crypto";
import { getProductBySlug } from "../catalog/catalog-data";
import { calculateOrderTotal, calculateShipping, calculateSubtotal } from "./pricing";
import { checkoutInputSchema } from "../validation/checkout";
import { MockPaymentProvider } from "../payments/mock-provider";

// Prepare an order preview from catalog records, recalculating every amount on the server.
export async function createMockCheckout(input: unknown) {
  const parsed = checkoutInputSchema.parse(input);
  const lines = parsed.items.map((item) => {
    const product = getProductBySlug(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    return { product, quantity: item.quantity, unitPrice: product.price };
  });
  const subtotal = calculateSubtotal(lines);
  const discount = 0;
  const shipping = calculateShipping(subtotal);
  const total = calculateOrderTotal(subtotal, discount);
  const provider = new MockPaymentProvider();
  const payment = await provider.createPayment({ orderId: `preview_${randomUUID()}`, amount: total, idempotencyKey: parsed.idempotencyKey });
  return { email: parsed.email, lines, subtotal, discount, shipping, total, payment };
}

