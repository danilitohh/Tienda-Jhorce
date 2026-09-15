import type { MetadataRoute } from "next";
import { PRODUCTS } from "@backend/catalog/catalog-data";
import { getSiteUrlString } from "@/lib/site-url";

// Keep the sitemap generated from the same product slugs used by the storefront.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrlString();
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }, { url: `${baseUrl}/catalogo`, lastModified: new Date(), changeFrequency: "daily", priority: .9 }, ...PRODUCTS.map((product) => ({ url: `${baseUrl}/producto/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .7 }))];
}
