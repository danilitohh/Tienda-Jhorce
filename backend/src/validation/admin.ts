import { z } from "zod";

const productStatus = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);
const productCategory = z.enum(["Esenciales", "Movimiento", "Accesorios"]);
const productMoney = z.number().int().min(0).max(1_000_000_000);
const productImage = z.string().trim().min(1).max(2_000).refine((value) => value.startsWith("/") || /^https?:\/\//i.test(value), "La imagen debe ser una ruta local o una URL http(s).");
const productOption = z.string().trim().min(1).max(40);

const productFields = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa un slug en minúsculas separado por guiones."),
  category: productCategory,
  price: productMoney,
  compareAtPrice: productMoney.optional(),
  description: z.string().trim().min(10).max(2_000),
  image: productImage,
  secondaryImage: productImage.optional(),
  badge: z.string().trim().max(60).optional(),
  sizes: z.array(productOption).max(20).optional(),
  colors: z.array(productOption).max(20).optional(),
  status: productStatus.default("DRAFT"),
  stock: z.number().int().min(0).max(1_000_000).optional(),
});

// Validate the complete product payload before it reaches a MongoDB write.
export const adminProductCreateSchema = productFields.superRefine((value, context) => {
  if (value.compareAtPrice !== undefined && value.compareAtPrice <= value.price) context.addIssue({ code: z.ZodIssueCode.custom, path: ["compareAtPrice"], message: "El precio anterior debe ser mayor al precio actual." });
});

// PATCH accepts the same fields selectively while keeping status and inventory edits explicit.
export const adminProductUpdateSchema = productFields.partial();

// Limit order transitions to the statuses the owner can operate from this panel.
export const adminOrderStatusSchema = z.object({ status: z.enum(["CREATED", "CONFIRMED", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]), note: z.string().trim().max(500).optional() });
