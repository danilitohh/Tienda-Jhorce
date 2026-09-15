import { describe, expect, it } from "vitest";
import { calculateOrderTotal, calculateShipping, calculateSubtotal } from "@backend/checkout/pricing";

describe("checkout pricing", () => {
  it("recalculates the subtotal from trusted unit prices", () => {
    expect(calculateSubtotal([{ unitPrice: 89000, quantity: 2 }, { unitPrice: 79000, quantity: 1 }])).toBe(257000);
  });

  it("applies free shipping at the configured threshold", () => {
    expect(calculateShipping(250000)).toBe(0);
    expect(calculateShipping(249999)).toBe(16000);
  });

  it("never lets a discount produce a negative order amount", () => {
    expect(calculateOrderTotal(89000, 100000)).toBe(0);
  });
});
