import type { MetadataRoute } from "next";
import { getSiteUrlString } from "@/lib/site-url";

// Allow public storefront discovery while keeping account and API surfaces out of search.
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrlString();
  return { rules: [{ userAgent: "*", allow: ["/", "/catalogo", "/producto/"], disallow: ["/api/", "/login", "/carrito", "/checkout"] }], sitemap: `${baseUrl}/sitemap.xml` };
}
