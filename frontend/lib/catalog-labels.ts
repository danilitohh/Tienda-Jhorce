import type { ProductCategory } from "@backend/catalog/catalog-data";

// Keep API category values stable while presenting language that matches byjhor's wig assortment.
export const categoryLabels: Readonly<Record<ProductCategory, string>> = {
  Esenciales: "Pelucas para cada día",
  Movimiento: "Pelucas con movimiento",
  Accesorios: "Cuidado y accesorios",
};

// Translate an internal category value anywhere it is rendered to customers.
export function getCategoryLabel(category: ProductCategory): string {
  return categoryLabels[category];
}

// Accessories use a neutral color label while wig variants are presented as hair tones.
export function getColorLabel(category: ProductCategory): string {
  return category === "Accesorios" ? "Color" : "Tono";
}
