"use client";

import { Funnel, SlidersHorizontal, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { ProductCategory, StoreProduct } from "@backend/catalog/catalog-data";
import { StoreSearchIcon } from "@/components/ui/store-icons";
import { CatalogSections } from "@/components/catalog/catalog-sections";
import { ProductCard } from "@/components/product-card";
import { getCategoryLabel } from "@/lib/catalog-labels";

const categories: ReadonlyArray<{ value: "Todos" | ProductCategory; label: string }> = [
  { value: "Todos", label: "Todas" },
  { value: "Esenciales", label: getCategoryLabel("Esenciales") },
  { value: "Movimiento", label: getCategoryLabel("Movimiento") },
  { value: "Accesorios", label: getCategoryLabel("Accesorios") },
];

// Client-side filtering keeps the catalog responsive while preserving the existing query and sort behavior.
export function CatalogView({ products, initialCategory = "Todos" }: Readonly<{ products: StoreProduct[]; initialCategory?: string }>) {
  const [query, setQuery] = useState("");
  const requestedCategory = categories.some((item) => item.value === initialCategory) ? initialCategory : "Todos";
  const [category, setCategory] = useState(requestedCategory);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = !query || `${product.name} ${getCategoryLabel(product.category)} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "Todos" || product.category === category;
    return matchesQuery && matchesCategory;
  }).sort((left, right) => sort === "price-asc" ? left.price - right.price : sort === "price-desc" ? right.price - left.price : 0), [category, products, query, sort]);
  const showCategorySections = category === "Todos" && !query.trim();

  return <>
    <div className="border-y border-ink/15 py-4 sm:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm"><StoreSearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="field-input w-full rounded-[8px] bg-paper pl-10 pr-9" placeholder="Buscar pelucas o accesorios" aria-label="Buscar productos" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink" aria-label="Limpiar búsqueda"><X size={16} /></button>}</div>
        <button onClick={() => setFiltersOpen((current) => !current)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-ink/15 px-4 text-sm font-medium text-ink transition-colors hover:border-gold-deep hover:bg-gold-pale lg:hidden" aria-expanded={filtersOpen} aria-controls="catalog-filters"><Funnel size={17} /> {filtersOpen ? "Cerrar filtros" : "Filtrar"}</button>
        <div id="catalog-filters" className={`${filtersOpen ? "grid" : "hidden"} gap-4 lg:flex lg:items-center`}>
          <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} aria-pressed={category === item.value} className={`rounded-[7px] border px-3 py-2 text-xs font-medium transition-colors ${category === item.value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-transparent text-ink hover:border-gold-deep hover:bg-gold-pale"}`}>{item.label}</button>)}</div>
          <label className="flex items-center gap-2 border-t border-ink/10 pt-3 text-xs font-medium lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0"><SlidersHorizontal size={16} /><span className="sr-only">Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-[8px] border border-ink/15 bg-paper px-3 py-2 text-xs outline-none focus:border-gold-deep"><option value="featured">Destacados</option><option value="price-asc">Precio menor</option><option value="price-desc">Precio mayor</option></select></label>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between py-6"><p className="text-sm text-muted">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</p><p className="hidden text-xs text-muted sm:block">Envío gratis desde $250.000</p></div>
    {filtered.length > 0 ? showCategorySections ? <CatalogSections products={filtered} /> : <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="surface-panel py-24 text-center"><p className="font-display text-3xl font-semibold leading-none">No encontramos esa peluca</p><p className="mt-3 text-sm text-muted">Prueba con otro nombre o vuelve a ver todas las opciones.</p><button onClick={() => { setQuery(""); setCategory("Todos"); }} className="button-primary mt-6">Ver toda la tienda</button></div>}
  </>;
}
