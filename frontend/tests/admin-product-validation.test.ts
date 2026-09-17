import { describe, expect, it } from "vitest";
import { adminProductCreateSchema, adminProductUpdateSchema } from "@backend/validation/admin";

const validProduct = {
  name: "Peluca Rizo Natural",
  slug: "peluca-rizo-natural",
  category: "Movimiento",
  price: 620000,
  description: "Rizos definidos con caída natural para acompañarte todos los días.",
  image: "/catalog/peluca-aura.webp",
  status: "ACTIVE",
  stock: 4,
};

// Cover the server validation boundary used by the admin product editor.
describe("admin product validation", () => {
  it("accepts a publishable product and applies its default fields", () => {
    const result = adminProductCreateSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.secondaryImage).toBeUndefined();
  });

  it("rejects a compare-at price that is not higher than the current price", () => {
    const result = adminProductCreateSchema.safeParse({ ...validProduct, compareAtPrice: 620000 });
    expect(result.success).toBe(false);
  });

  it("allows a stock-only update without requiring the rest of the product", () => {
    expect(adminProductUpdateSchema.safeParse({ stock: 2 }).success).toBe(true);
  });

  it("rejects unsafe image protocols", () => {
    expect(adminProductCreateSchema.safeParse({ ...validProduct, image: "javascript:alert(1)" }).success).toBe(false);
  });
});
