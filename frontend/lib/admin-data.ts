import { randomUUID } from "node:crypto";
import type { AdminDashboardData, AdminOrder, AdminOrderStatus, AdminProduct, AdminProductInput } from "@backend/admin/admin-types";
import { ObjectId, type Document, type WithId } from "mongodb";
import { getCatalogCollection, getCatalogIdFilter, mapCatalogProduct, readCatalogDate, readCatalogNumber, readCatalogString } from "@/lib/catalog-repository";
import { getMongoDatabase } from "@/lib/mongodb";

type DashboardResult =
  | Readonly<{ state: "ready"; data: AdminDashboardData }>
  | Readonly<{ state: "not-configured" | "unavailable"; message: string }>;

// Map a flexible order document into the small operational projection rendered by the owner dashboard.
function mapOrder(document: WithId<Document>): AdminOrder {
  const id = typeof document.id === "string" ? document.id : typeof document._id === "string" ? document._id : document._id?.toString() ?? "";
  const customer = typeof document.customer === "object" && document.customer ? document.customer as Document : null;
  const items = Array.isArray(document.items) ? document.items : Array.isArray(document.lines) ? document.lines : [];
  return {
    id,
    number: readCatalogString(document.orderNumber ?? document.number, id),
    status: readCatalogString(document.status, "CREATED").toUpperCase(),
    total: readCatalogNumber(document.total ?? document.totalAmount),
    currency: readCatalogString(document.currency, "COP"),
    customerName: readCatalogString(document.customerName ?? customer?.name, "Cliente").slice(0, 120),
    customerEmail: readCatalogString(document.customerEmail ?? document.email ?? customer?.email, "").slice(0, 320),
    itemCount: items.reduce((sum, item) => sum + (typeof item === "object" && item ? Math.max(1, Math.trunc(readCatalogNumber((item as Document).quantity, 1))) : 1), 0),
    createdAt: readCatalogDate(document.createdAt),
  };
}

// Use a typed error so route handlers can distinguish conflicts and missing records from service outages.
export class AdminDataError extends Error {
  constructor(public readonly code: "NOT_FOUND" | "CONFLICT" | "UNAVAILABLE", message: string) {
    super(message);
    this.name = "AdminDataError";
  }
}

// Read all manageable products with their public fields so the form edits the same contract customers see.
export async function listAdminProducts(): Promise<AdminProduct[]> {
  const collection = await getCatalogCollection();
  if (!collection) throw new AdminDataError("UNAVAILABLE", "MongoDB no está configurado para el catálogo.");
  const documents = await collection.find({ deletedAt: { $exists: false } }).sort({ updatedAt: -1, createdAt: -1 }).limit(100).toArray();
  return documents.map(mapCatalogProduct);
}

// Insert a product with server-owned identifiers, timestamps and operational defaults.
export async function createAdminProduct(input: AdminProductInput) {
  const collection = await getCatalogCollection();
  if (!collection) throw new AdminDataError("UNAVAILABLE", "MongoDB no está configurado para el catálogo.");
  if (await collection.findOne({ slug: input.slug, deletedAt: { $exists: false } })) throw new AdminDataError("CONFLICT", "Ya existe un producto con ese slug.");
  const now = new Date();
  const document = { _id: randomUUID(), ...input, secondaryImage: input.secondaryImage ?? input.image, rating: 0, reviewCount: 0, createdAt: now, updatedAt: now };
  try {
    await collection.insertOne(document);
  } catch (error) {
    if (typeof error === "object" && error && Reflect.get(error, "code") === 11000) throw new AdminDataError("CONFLICT", "Ya existe un producto con ese slug.");
    throw error;
  }
  return mapCatalogProduct(document);
}

// Update only validated product fields and keep the existing document identity stable for carts and links.
export async function updateAdminProduct(id: string, input: Partial<AdminProductInput>) {
  const collection = await getCatalogCollection();
  if (!collection) throw new AdminDataError("UNAVAILABLE", "MongoDB no está configurado para el catálogo.");
  if (input.slug) {
    const duplicate = await collection.findOne({ slug: input.slug, deletedAt: { $exists: false } });
    if (duplicate && mapCatalogProduct(duplicate).id !== id) throw new AdminDataError("CONFLICT", "Ya existe un producto con ese slug.");
  }
  const now = new Date();
  try {
    const document = await collection.findOneAndUpdate(getCatalogIdFilter(id), { $set: { ...input, ...(input.image && !input.secondaryImage ? { secondaryImage: input.image } : {}), updatedAt: now } }, { returnDocument: "after" });
    if (!document) throw new AdminDataError("NOT_FOUND", "No encontramos ese producto.");
    return mapCatalogProduct(document);
  } catch (error) {
    if (error instanceof AdminDataError) throw error;
    if (typeof error === "object" && error && Reflect.get(error, "code") === 11000) throw new AdminDataError("CONFLICT", "Ya existe un producto con ese slug.");
    throw error;
  }
}

// Keep orders available for future checkout writers while limiting this dashboard to actionable recent records.
async function listRecentOrders(limit = 20): Promise<AdminOrder[]> {
  const database = await getMongoDatabase();
  if (!database) throw new AdminDataError("UNAVAILABLE", "MongoDB no está configurado para los pedidos.");
  const collection = database.collection(process.env.MONGODB_ORDERS_COLLECTION ?? "orders");
  const documents = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
  return documents.map(mapOrder);
}

// Update order status and append a small history entry so the owner can trace operational changes.
export async function updateAdminOrderStatus(id: string, status: AdminOrderStatus, note: string | undefined, changedBy: string) {
  const database = await getMongoDatabase();
  if (!database) throw new AdminDataError("UNAVAILABLE", "MongoDB no está configurado para los pedidos.");
  const collection = database.collection(process.env.MONGODB_ORDERS_COLLECTION ?? "orders");
  const now = new Date();
  const orderFilters: Document[] = [{ _id: id } as unknown as Document, { id }];
  if (ObjectId.isValid(id)) orderFilters.push({ _id: new ObjectId(id) });
  const update: Document = { $set: { status, updatedAt: now }, $push: { statusHistory: { status, note, changedBy, createdAt: now } } };
  const document = await collection.findOneAndUpdate({ $or: orderFilters }, update, { returnDocument: "after" });
  if (!document) throw new AdminDataError("NOT_FOUND", "No encontramos ese pedido.");
  return mapOrder(document);
}

// Query MongoDB only from the server after the admin page has validated the session role.
export async function loadAdminDashboard(): Promise<DashboardResult> {
  const database = await getMongoDatabase();
  if (!database) return { state: "not-configured", message: "Falta MONGODB_URI para leer la operación de la tienda." };

  try {
    const [products, recentOrders] = await Promise.all([listAdminProducts(), listRecentOrders()]);
    return { state: "ready", data: { products, recentOrders } };
  } catch {
    return { state: "unavailable", message: "No fue posible conectar con MongoDB. Revisa el URI, el nombre de la base y las colecciones configuradas." };
  }
}
