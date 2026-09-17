import type { MetadataRoute } from "next";
import { getSiteUrlString } from "@/lib/site-url";
import { listStoreProducts } from "@/lib/catalog-repository";

// Keep the sitemap generated from the same product slugs used by the storefront.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrlString();
  const products = await listStoreProducts();
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }, { url: `${baseUrl}/catalogo`, lastModified: new Date(), changeFrequency: "daily", priority: .9 }, ...products.map((product) => ({ url: `${baseUrl}/producto/${product.slug}`, lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(), changeFrequency: "weekly" as const, priority: .7 }))];
}
