import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { PaymentEvent, PaymentIntent, PaymentProvider } from "./types";

// A deterministic sandbox adapter exercises approval, rejection, pending, webhook and refund paths.
export class MockPaymentProvider implements PaymentProvider {
  private readonly secret: string;
  private readonly payments = new Map<string, PaymentIntent>();

  constructor(secret = process.env.MOCK_PAYMENT_WEBHOOK_SECRET ?? "local-development-secret") {
    this.secret = secret;
  }

  // Create a pending payment without storing or receiving any sensitive card data.
  async createPayment(input: { orderId: string; amount: number; idempotencyKey: string }): Promise<PaymentIntent> {
    const existing = [...this.payments.values()].find((payment) => payment.clientSecret === input.idempotencyKey);
    if (existing) return existing;
    const payment: PaymentIntent = {
      id: `mock_${randomUUID()}`,
      amount: input.amount,
      currency: "COP",
      status: "pending",
      provider: "mock",
      clientSecret: input.idempotencyKey,
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  // Simulate gateway decisioning through a controlled test-only parameter.
  async confirmPayment(input: { paymentId: string; simulation?: "approved" | "rejected" | "pending" }): Promise<PaymentIntent> {
    const payment = this.payments.get(input.paymentId);
    if (!payment) throw new Error("Payment not found");
    payment.status = input.simulation ?? "approved";
    return payment;
  }

  // Verify the HMAC before accepting a simulated webhook event.
  async handleWebhook(input: { payload: string; signature: string }): Promise<PaymentEvent> {
    const expected = createHmac("sha256", this.secret).update(input.payload).digest("hex");
    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(input.signature, "utf8");
    if (expectedBuffer.length !== receivedBuffer.length || !timingSafeEqual(expectedBuffer, receivedBuffer)) {
      throw new Error("Invalid payment webhook signature");
    }
    return JSON.parse(input.payload) as PaymentEvent;
  }

  // Move an approved sandbox payment to refunded without exposing provider-specific details.
  async refundPayment(input: { paymentId: string; amount?: number }): Promise<PaymentIntent> {
    const payment = this.payments.get(input.paymentId);
    if (!payment) throw new Error("Payment not found");
    if (input.amount !== undefined && input.amount > payment.amount) throw new Error("Refund exceeds payment amount");
    payment.status = "refunded";
    return payment;
  }
}
