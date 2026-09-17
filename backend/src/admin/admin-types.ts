// These types are the narrow read model needed by the first owner-facing administration screen.
import type { ProductCategory, StoreProduct } from "../catalog/catalog-data";

export type AdminProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

// Admin product rows extend the public product contract so every saved change can be rendered by the storefront.
export type AdminProduct = Readonly<StoreProduct & {
  status: AdminProductStatus;
  stock: number | null;
  updatedAt: string;
}>;

export type AdminProductInput = Readonly<{
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  image: string;
  secondaryImage?: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
  status?: AdminProductStatus;
  stock?: number;
}>;

export type AdminOrder = Readonly<{
  id: string;
  number: string;
  status: string;
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  createdAt: string;
}>;

export const ADMIN_ORDER_STATUSES = ["CREATED", "CONFIRMED", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const;
export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export type AdminDashboardData = Readonly<{
  products: AdminProduct[];
  recentOrders: AdminOrder[];
}>;
