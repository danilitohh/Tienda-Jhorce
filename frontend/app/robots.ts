import type { MetadataRoute } from "next";

// Allow public storefront discovery while keeping account and API surfaces out of search.
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return { rules: [{ userAgent: "*", allow: ["/", "/catalogo", "/producto/"], disallow: ["/api/", "/login", "/carrito", "/checkout"] }], sitemap: `${baseUrl}/sitemap.xml` };
}

