export type PriceLine = {
  unitPrice: number;
  quantity: number;
};

// Recalculate subtotal from server-owned prices and quantities.
export function calculateSubtotal(lines: PriceLine[]): number {
  return lines.reduce((subtotal, line) => subtotal + line.unitPrice * line.quantity, 0);
}

// Apply the fixed shipping policy in one place until zone-based rates are configured in admin.
export function calculateShipping(subtotal: number): number {
  return subtotal >= 250000 || subtotal === 0 ? 0 : 16000;
}

// Build the final COP amount from trusted server-side components.
export function calculateOrderTotal(subtotal: number, discount: number): number {
  return Math.max(0, subtotal - discount) + calculateShipping(Math.max(0, subtotal - discount));
}

