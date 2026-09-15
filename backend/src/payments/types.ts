export type PaymentIntent = {
  id: string;
  amount: number;
  currency: "COP";
  status: "pending" | "approved" | "rejected" | "refunded";
  provider: string;
  clientSecret: string;
};

export type PaymentEvent = {
  eventId: string;
  paymentId: string;
  type: "payment.approved" | "payment.rejected" | "payment.pending" | "payment.refunded";
  amount: number;
  signature: string;
};

// The rest of the checkout system depends on this contract, never on a specific gateway SDK.
export interface PaymentProvider {
  createPayment(input: { orderId: string; amount: number; idempotencyKey: string }): Promise<PaymentIntent>;
  confirmPayment(input: { paymentId: string; simulation?: "approved" | "rejected" | "pending" }): Promise<PaymentIntent>;
  handleWebhook(input: { payload: string; signature: string }): Promise<PaymentEvent>;
  refundPayment(input: { paymentId: string; amount?: number }): Promise<PaymentIntent>;
}
