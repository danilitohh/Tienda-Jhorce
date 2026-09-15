"use client";

import { Funnel, MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { ProductCard } from "@/components/product-card";

const categories = ["Todos", "Esenciales", "Movimiento", "Accesorios"] as const;

// Client-side filtering keeps the demo catalog fast and can later map one-to-one to API query params.
export function CatalogView({ products, initialCategory = "Todos" }: Readonly<{ products: StoreProduct[]; initialCategory?: string }>) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = !query || `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "Todos" || product.category === category;
    return matchesQuery && matchesCategory;
  }).sort((left, right) => sort === "price-asc" ? left.price - right.price : sort === "price-desc" ? right.price - left.price : 0), [category, products, query, sort]);

  return <>
    <div className="border-y border-ink/10 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm"><MagnifyingGlass className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border-0 border-b border-ink/20 bg-transparent py-2 pl-7 text-sm outline-none placeholder:text-slate-400 focus:border-accent" placeholder="Buscar por nombre o categoría" aria-label="Buscar productos" />{query && <button onClick={() => setQuery("")} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-accent" aria-label="Limpiar búsqueda"><X size={16} /></button>}</div>
        <button onClick={() => setFiltersOpen((current) => !current)} className="flex items-center gap-2 text-sm font-medium lg:hidden"><Funnel size={17} /> Filtros</button>
        <div className={`${filtersOpen ? "grid" : "hidden"} gap-3 lg:flex lg:items-center`}>
          <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`px-3 py-2 text-xs font-medium transition-colors ${category === item ? "bg-ink text-white" : "bg-mist/60 text-ink hover:bg-mist"}`}>{item}</button>)}</div>
          <label className="flex items-center gap-2 border-l border-ink/10 pl-4 text-xs font-medium"><SlidersHorizontal size={16} /><span className="sr-only">Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent py-2 outline-none"><option value="featured">Destacados</option><option value="price-asc">Precio menor</option><option value="price-desc">Precio mayor</option></select></label>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between py-6"><p className="text-sm text-slate-500">{filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}</p><p className="hidden text-xs text-slate-400 sm:block">Envío gratis desde $250.000</p></div>
    {filtered.length > 0 ? <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="py-24 text-center"><p className="font-display text-2xl font-semibold">No encontramos ese producto</p><p className="mt-2 text-sm text-slate-500">Prueba con otro nombre o vuelve a ver todos los esenciales.</p><button onClick={() => { setQuery(""); setCategory("Todos"); }} className="mt-6 bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">Ver toda la tienda</button></div>}
  </>;
}

