import type { AdminDashboardData, AdminOrder, AdminProduct, AdminProductStatus } from "@backend/admin/admin-types";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

type DashboardResult =
  | Readonly<{ state: "ready"; data: AdminDashboardData }>
  | Readonly<{ state: "not-configured" | "unavailable"; message: string }>;

type ProductRow = Readonly<{ id: string; name: string; slug: string; status: string; basePrice: number | string; updatedAt: string }>;
type VariantRow = Readonly<{ id: string; productId: string }>;
type InventoryRow = Readonly<{ variantId: string; available: number }>;
type OrderRow = Readonly<{ id: string; orderNumber: string; status: string; total: number | string; currency: string; createdAt: string }>;

const productStatuses = new Set<AdminProductStatus>(["DRAFT", "ACTIVE", "ARCHIVED"]);

// Convert numeric database values consistently because the Data API can serialize decimals as strings.
function toNumber(value: number | string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Query the existing Prisma-named tables through Supabase only from the server after role validation.
export async function loadAdminDashboard(): Promise<DashboardResult> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { state: "not-configured", message: "Falta la conexión segura de Supabase para leer la operación de la tienda." };

  const [productsResult, variantsResult, inventoryResult, ordersResult] = await Promise.all([
    supabase.from("Product").select("id,name,slug,status,basePrice,updatedAt").order("updatedAt", { ascending: false }).limit(12),
    supabase.from("ProductVariant").select("id,productId"),
    supabase.from("Inventory").select("variantId,available"),
    supabase.from("Order").select("id,orderNumber,status,total,currency,createdAt").order("createdAt", { ascending: false }).limit(8),
  ]);

  const failed = [productsResult, variantsResult, inventoryResult, ordersResult].find((result) => result.error);
  if (failed?.error) return { state: "unavailable", message: "No fue posible cargar los datos administrativos. Revisa la exposición de las tablas y los permisos de Supabase." };

  const inventoryByVariant = new Map((inventoryResult.data as InventoryRow[] ?? []).map((inventory) => [inventory.variantId, inventory.available]));
  const stockByProduct = new Map<string, number>();
  (variantsResult.data as VariantRow[] ?? []).forEach((variant) => {
    stockByProduct.set(variant.productId, (stockByProduct.get(variant.productId) ?? 0) + (inventoryByVariant.get(variant.id) ?? 0));
  });

  const products: AdminProduct[] = (productsResult.data as ProductRow[] ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    status: productStatuses.has(product.status as AdminProductStatus) ? product.status as AdminProductStatus : "DRAFT",
    price: toNumber(product.basePrice),
    stock: stockByProduct.has(product.id) ? stockByProduct.get(product.id) ?? 0 : null,
    updatedAt: product.updatedAt,
  }));

  const recentOrders: AdminOrder[] = (ordersResult.data as OrderRow[] ?? []).map((order) => ({
    id: order.id,
    number: order.orderNumber,
    status: order.status,
    total: toNumber(order.total),
    currency: order.currency,
    createdAt: order.createdAt,
  }));

  return { state: "ready", data: { products, recentOrders } };
}
