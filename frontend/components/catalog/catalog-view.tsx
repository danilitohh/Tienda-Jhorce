"use client";

import { CaretDown, SlidersHorizontal, X } from "@phosphor-icons/react";
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
        <div className="relative hidden flex-1 lg:block lg:max-w-sm"><StoreSearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="field-input w-full rounded-[8px] bg-paper pl-10 pr-9" placeholder="Buscar pelucas o accesorios" aria-label="Buscar productos" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink" aria-label="Limpiar búsqueda"><X size={16} /></button>}</div>
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <label className="relative flex h-12 items-center rounded-[9px] border border-gold/50 bg-surface px-4 text-base font-medium text-ink"><span className="sr-only">Ordenar productos</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-full w-full appearance-none bg-transparent pr-6 outline-none"><option value="featured">Destacados</option><option value="price-asc">Precio menor</option><option value="price-desc">Precio mayor</option></select><CaretDown aria-hidden="true" className="pointer-events-none absolute right-4" size={16} weight="bold" /></label>
          <button onClick={() => setFiltersOpen((current) => !current)} className="inline-flex h-12 items-center justify-between rounded-[9px] border border-gold/50 bg-surface px-4 text-base font-medium text-ink transition-colors hover:bg-gold-pale" aria-expanded={filtersOpen} aria-controls="catalog-filters"><span className="inline-flex items-center gap-3"><SlidersHorizontal size={20} />Filtrar</span><CaretDown aria-hidden="true" size={16} weight="bold" /></button>
        </div>
        <div id="catalog-filters" className={`${filtersOpen ? "grid" : "hidden"} gap-4 lg:flex lg:flex-1 lg:items-center lg:justify-end`}>
          <div className="relative lg:hidden"><StoreSearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="field-input h-12 w-full rounded-[8px] bg-paper pl-10 pr-9" placeholder="Buscar pelucas o accesorios" aria-label="Buscar productos" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink" aria-label="Limpiar búsqueda"><X size={16} /></button>}</div>
          <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} aria-pressed={category === item.value} className={`rounded-[7px] border px-3 py-2 text-xs font-medium transition-colors ${category === item.value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-transparent text-ink hover:border-gold-deep hover:bg-gold-pale"}`}>{item.label}</button>)}</div>
          <label className="relative hidden lg:flex lg:h-10 lg:w-40 lg:items-center lg:rounded-[8px] lg:border lg:border-ink/15 lg:bg-paper lg:px-3"><span className="sr-only">Ordenar productos</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-full w-full appearance-none bg-transparent pr-5 text-xs font-medium outline-none"><option value="featured">Destacados</option><option value="price-asc">Precio menor</option><option value="price-desc">Precio mayor</option></select><CaretDown aria-hidden="true" className="pointer-events-none absolute right-3" size={14} weight="bold" /></label>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between py-6"><p className="text-sm text-muted">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</p><p className="hidden text-xs text-muted sm:block">Envío gratis desde $250.000</p></div>
    {filtered.length > 0 ? showCategorySections ? <CatalogSections products={filtered} /> : <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="surface-panel py-24 text-center"><p className="font-display text-3xl font-semibold leading-none">No encontramos esa peluca</p><p className="mt-3 text-sm text-muted">Prueba con otro nombre o vuelve a ver todas las opciones.</p><button onClick={() => { setQuery(""); setCategory("Todos"); }} className="button-primary mt-6">Ver toda la tienda</button></div>}
  </>;
}
