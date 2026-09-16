import type { Metadata } from "next";
import { listProducts } from "@backend/catalog/catalog-data";
import { CatalogView } from "@/components/catalog/catalog-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Tienda", description: "Explora esenciales, movimiento y accesorios byjhor." };

// Render the catalog shell on the server and pass demo records to the interactive filter island.
export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const initialCategory = params.category ?? "Todos";
  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-14 sm:py-20 lg:py-24"><div className="max-w-2xl"><p className="eyebrow">La tienda byjhor</p><h1 className="mt-5 font-display text-6xl font-semibold leading-[.9] tracking-[-.04em] sm:text-8xl">Piezas para<br />seguir tu ritmo.</h1><p className="mt-6 max-w-lg text-base leading-7 text-muted">Una selección precisa de esenciales, movimiento y accesorios. Sin exceso. Solo lo que funciona.</p></div><div className="mt-14"><CatalogView products={listProducts()} initialCategory={initialCategory} /></div></main><SiteFooter /></>;
}
