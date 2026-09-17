import type { Metadata } from "next";
import { PRODUCTS, type ProductCategory } from "@backend/catalog/catalog-data";
import { listStoreProducts } from "@/lib/catalog-repository";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { CatalogView } from "@/components/catalog/catalog-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Tienda de pelucas", description: "Explora pelucas, largos, tonos y accesorios byjhor." };
export const dynamic = "force-dynamic";

const categoryValues: ProductCategory[] = ["Esenciales", "Movimiento", "Accesorios"];

// Render the catalog shell on the server and keep its visual category context in sync with the query string.
export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const selectedCategory = categoryValues.includes(params.category as ProductCategory) ? params.category as ProductCategory : "Todos";
  const products = await listStoreProducts();
  const heroProduct = products.find((product) => selectedCategory === "Todos" ? product.category === "Movimiento" : product.category === selectedCategory) ?? products[0] ?? PRODUCTS[0];

  return <><SiteHeader /><CatalogHero category={selectedCategory} product={heroProduct} /><main id="productos" className="site-shell min-h-[65vh] scroll-mt-32 py-10 sm:py-14 lg:py-16"><CatalogView key={selectedCategory} products={products} initialCategory={selectedCategory} /></main><SiteFooter /></>;
}
