import type { Metadata } from "next";
import { listProducts } from "@backend/catalog/catalog-data";
import { CatalogView } from "@/components/catalog/catalog-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Tienda", description: "Explora esenciales, movimiento y accesorios Jhorce." };

// Render the catalog shell on the server and pass demo records to the interactive filter island.
export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const initialCategory = params.category ?? "Todos";
  return <><SiteHeader /><main className="mx-auto min-h-[65vh] max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">La tienda Jhorce</p><h1 className="mt-5 font-display text-5xl font-bold tracking-[-.08em] sm:text-7xl">Piezas para<br />seguir tu ritmo.</h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-500">Una selección precisa de esenciales, movimiento y accesorios. Sin exceso. Solo lo que funciona.</p></div><div className="mt-14"><CatalogView products={listProducts()} initialCategory={initialCategory} /></div></main><SiteFooter /></>;
}

