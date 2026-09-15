import { z } from "zod";

// Client checkout input contains identifiers and quantities only; money is intentionally absent.
export const checkoutInputSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(50),
  email: z.string().email(),
  idempotencyKey: z.string().uuid(),
});

