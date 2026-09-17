import type { AdminProduct, AdminProductStatus } from "@backend/admin/admin-types";
import type { ProductCategory, StoreProduct } from "@backend/catalog/catalog-data";
import { PRODUCTS } from "@backend/catalog/catalog-data";
import { ObjectId, type Collection } from "mongodb";
import { getMongoDatabase } from "@/lib/mongodb";

export type CatalogProductRecord = Readonly<AdminProduct>;

// Keep the Mongo document shape flexible enough to read the store's existing catalog without a destructive migration.
export type CatalogProductDocument = Readonly<{ _id?: string | ObjectId; id?: unknown; slug?: unknown; name?: unknown; category?: unknown; categoryName?: unknown; price?: unknown; basePrice?: unknown; promotionalPrice?: unknown; compareAtPrice?: unknown; description?: unknown; shortDescription?: unknown; image?: unknown; secondaryImage?: unknown; images?: unknown; badge?: unknown; sizes?: unknown; colors?: unknown; rating?: unknown; reviewCount?: unknown; stock?: unknown; available?: unknown; inventory?: unknown; status?: unknown; updatedAt?: unknown; createdAt?: unknown; deletedAt?: unknown; [key: string]: unknown }>;

const fallbackImage = "/catalog/peluca-aura.webp";
const productStatuses = new Set<AdminProductStatus>(["DRAFT", "ACTIVE", "ARCHIVED"]);
const productCategories = new Set<ProductCategory>(["Esenciales", "Movimiento", "Accesorios"]);

// Coerce scalar values at the persistence boundary so malformed legacy documents never reach React props.
export function readCatalogString(value: unknown, fallback: string) { return typeof value === "string" && value.trim() ? value.trim() : fallback; }
export function readCatalogNumber(value: unknown, fallback = 0) { const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN; return Number.isFinite(parsed) ? parsed : fallback; }
export function readCatalogDate(value: unknown) { const date = value instanceof Date ? value : typeof value === "string" || typeof value === "number" ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toISOString() : ""; }

function readCatalogArray(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim()).slice(0, 20) : []; }
function readCategory(document: CatalogProductDocument): ProductCategory { const value = readCatalogString(document.category ?? document.categoryName, "Esenciales"); return productCategories.has(value as ProductCategory) ? value as ProductCategory : value.toLowerCase().includes("mov") ? "Movimiento" : value.toLowerCase().includes("acc") ? "Accesorios" : "Esenciales"; }
function readStatus(value: unknown): AdminProductStatus { const status = typeof value === "string" ? value.toUpperCase() : "DRAFT"; return productStatuses.has(status as AdminProductStatus) ? status as AdminProductStatus : "DRAFT"; }
function readImage(document: CatalogProductDocument, secondary = false) {
  const direct = secondary ? document.secondaryImage : document.image;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const images = Array.isArray(document.images) ? document.images : [];
  const imageDocument = images.find((item) => typeof item === "object" && item && ((item as Record<string, unknown>).position ?? 0) === (secondary ? 1 : 0));
  if (typeof imageDocument === "object" && imageDocument && typeof (imageDocument as Record<string, unknown>).url === "string") return ((imageDocument as Record<string, unknown>).url as string).trim();
  return fallbackImage;
}

// Map Mongo records into the exact public product contract shared by cards, detail pages and checkout previews.
export function mapCatalogProduct(document: CatalogProductDocument): CatalogProductRecord {
  const id = typeof document.id === "string" ? document.id : document._id instanceof ObjectId ? document._id.toHexString() : String(document._id ?? "");
  const basePrice = readCatalogNumber(document.basePrice, readCatalogNumber(document.price));
  const promotionalPrice = readCatalogNumber(document.promotionalPrice, 0);
  const price = readCatalogNumber(document.price, promotionalPrice > 0 ? promotionalPrice : basePrice);
  const inventory = typeof document.inventory === "object" && document.inventory ? document.inventory as Record<string, unknown> : null;
  const stockValue = document.stock ?? document.available ?? inventory?.available;
  const images = { image: readImage(document), secondaryImage: readImage(document, true) };
  const sizes = readCatalogArray(document.sizes);
  const colors = readCatalogArray(document.colors);
  return {
    id,
    slug: readCatalogString(document.slug, id),
    name: readCatalogString(document.name, "Producto sin nombre"),
    category: readCategory(document),
    price,
    compareAtPrice: document.compareAtPrice !== undefined ? readCatalogNumber(document.compareAtPrice) : promotionalPrice > 0 && basePrice > promotionalPrice ? basePrice : undefined,
    description: readCatalogString(document.description ?? document.shortDescription, "Descubre este estilo byjhor."),
    ...images,
    badge: typeof document.badge === "string" && document.badge.trim() ? document.badge.trim() : undefined,
    sizes: sizes.length ? sizes : undefined,
    colors: colors.length ? colors : undefined,
    rating: readCatalogNumber(document.rating),
    reviewCount: readCatalogNumber(document.reviewCount),
    status: readStatus(document.status),
    stock: stockValue === undefined ? null : Math.max(0, Math.trunc(readCatalogNumber(stockValue))),
    updatedAt: readCatalogDate(document.updatedAt),
  };
}

// Centralize the server-only collection lookup so public reads and admin writes share the same configured collection.
export async function getCatalogCollection(): Promise<Collection<CatalogProductDocument> | null> {
  const database = await getMongoDatabase();
  return database ? database.collection<CatalogProductDocument>(process.env.MONGODB_PRODUCTS_COLLECTION ?? "products") : null;
}

// Resolve both UUID-style and ObjectId-style records without exposing database identifiers to clients.
export function getCatalogIdFilter(id: string) {
  const filters: Array<Record<string, unknown>> = [{ _id: id }, { id }];
  if (ObjectId.isValid(id)) filters.push({ _id: new ObjectId(id) });
  return { $or: filters };
}

// Read the Mongo catalog when it has data, otherwise preserve the existing reviewable catalog as a safe bootstrap fallback.
export async function loadStoreCatalog(): Promise<CatalogProductRecord[]> {
  const collection = await getCatalogCollection();
  if (!collection) return PRODUCTS.map((product) => ({ ...product, status: "ACTIVE" as const, stock: null, updatedAt: "" }));
  try {
    const documents = await collection.find({ deletedAt: { $exists: false } }).sort({ updatedAt: -1, createdAt: -1 }).limit(200).toArray();
    if (!documents.length) return PRODUCTS.map((product) => ({ ...product, status: "ACTIVE" as const, stock: null, updatedAt: "" }));
    return documents.map(mapCatalogProduct);
  } catch {
    return PRODUCTS.map((product) => ({ ...product, status: "ACTIVE" as const, stock: null, updatedAt: "" }));
  }
}

// Apply public search, category and sort rules after the repository has selected the active source.
export async function listStoreProducts(input?: { query?: string; category?: string; sort?: "featured" | "price-asc" | "price-desc" }) {
  const products = (await loadStoreCatalog()).filter((product) => product.status === "ACTIVE");
  const query = input?.query?.trim().toLowerCase();
  const category = input?.category;
  const filtered = products.filter((product) => (!query || `${product.name} ${product.category} ${product.slug}`.toLowerCase().includes(query)) && (!category || category === "Todos" || product.category === category));
  return [...filtered].sort((left, right) => input?.sort === "price-asc" ? left.price - right.price : input?.sort === "price-desc" ? right.price - left.price : 0);
}

// Resolve one published product for dynamic detail pages, including products created from the admin panel.
export async function getStoreProductBySlug(slug: string) { return (await loadStoreCatalog()).find((product) => product.status === "ACTIVE" && product.slug === slug); }
