import type { AdminDashboardData, AdminOrder, AdminProduct, AdminProductStatus } from "@backend/admin/admin-types";
import type { Document, WithId } from "mongodb";
import { getMongoDatabase } from "@/lib/mongodb";

type DashboardResult =
  | Readonly<{ state: "ready"; data: AdminDashboardData }>
  | Readonly<{ state: "not-configured" | "unavailable"; message: string }>;

const productStatuses = new Set<AdminProductStatus>(["DRAFT", "ACTIVE", "ARCHIVED"]);

// Coerce safe scalar values from MongoDB documents without assuming a client-controlled document shape.
function readNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readDate(value: unknown) {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value.toISOString() : "";
}

function readStatus(value: unknown): AdminProductStatus {
  const normalized = typeof value === "string" ? value.toUpperCase() : "DRAFT";
  return productStatuses.has(normalized as AdminProductStatus) ? normalized as AdminProductStatus : "DRAFT";
}

// Map the catalog document fields while allowing the collection names to be tailored through Vercel env vars.
function mapProduct(document: WithId<Document>): AdminProduct {
  const id = typeof document.id === "string" ? document.id : document._id.toHexString();
  const inventory = typeof document.inventory === "object" && document.inventory ? document.inventory as Document : null;
  const stockValue = document.stock ?? document.available ?? inventory?.available;

  return {
    id,
    name: readString(document.name, "Producto sin nombre"),
    slug: readString(document.slug, id),
    status: readStatus(document.status),
    price: readNumber(document.price ?? document.basePrice),
    stock: stockValue === undefined ? null : readNumber(stockValue),
    updatedAt: readDate(document.updatedAt),
  };
}

// Map the minimal order shape needed for the owner's operational overview.
function mapOrder(document: WithId<Document>): AdminOrder {
  const id = typeof document.id === "string" ? document.id : document._id.toHexString();
  return {
    id,
    number: readString(document.orderNumber ?? document.number, id),
    status: readString(document.status, "CREATED"),
    total: readNumber(document.total ?? document.totalAmount),
    currency: readString(document.currency, "COP"),
    createdAt: readDate(document.createdAt),
  };
}

// Query MongoDB only from the server after app_metadata.role has been validated by the admin page.
export async function loadAdminDashboard(): Promise<DashboardResult> {
  const database = await getMongoDatabase();
  if (!database) return { state: "not-configured", message: "Falta MONGODB_URI para leer la operación de la tienda." };

  try {
    const productsCollection = process.env.MONGODB_PRODUCTS_COLLECTION ?? "products";
    const ordersCollection = process.env.MONGODB_ORDERS_COLLECTION ?? "orders";
    const [productDocuments, orderDocuments] = await Promise.all([
      database.collection(productsCollection).find({}).sort({ updatedAt: -1 }).limit(12).toArray(),
      database.collection(ordersCollection).find({}).sort({ createdAt: -1 }).limit(8).toArray(),
    ]);

    return { state: "ready", data: { products: productDocuments.map(mapProduct), recentOrders: orderDocuments.map(mapOrder) } };
  } catch {
    return { state: "unavailable", message: "No fue posible conectar con MongoDB. Revisa el URI, el nombre de la base y las colecciones configuradas." };
  }
}
