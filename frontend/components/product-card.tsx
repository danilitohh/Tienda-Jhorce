"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Plus } from "@phosphor-icons/react";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { useCart } from "@/components/cart/cart-provider";
import { formatCop } from "@/lib/format";
import { SpotlightCard } from "@/components/react-bits/spotlight-card";

// Product cards keep discovery playful while the purchase action remains immediate and accessible.
export function ProductCard({ product }: Readonly<{ product: StoreProduct }>) {
  const { addItem } = useCart();

  return (
    <SpotlightCard className="h-full">
      <article className="group h-full">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`} className="relative block h-full w-full">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          </Link>
          <div className="absolute left-3 top-3 flex items-center gap-2"><span className="bg-paper px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em]">{product.category}</span>{product.badge && <span className="bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white">{product.badge}</span>}</div>
          <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-paper/90 transition-colors hover:bg-accent hover:text-white" aria-label={`Guardar ${product.name}`}><Heart size={17} weight="light" /></button>
          <button onClick={() => addItem(product)} className="absolute bottom-3 right-3 z-20 flex h-10 items-center gap-2 bg-ink px-3 text-xs font-medium text-white transition-all duration-300 hover:bg-accent lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100" aria-label={`Añadir ${product.name} al carrito`}><Plus size={16} /> Añadir</button>
        </div>
        <div className="flex items-start justify-between gap-3 pt-4">
          <div><Link href={`/producto/${product.slug}`} className="font-display text-[17px] font-semibold tracking-[-.03em] hover:text-accent">{product.name}</Link><p className="mt-1 text-xs text-slate-500">{product.colors?.[0] ?? "Diseño esencial"}</p></div>
          <div className="text-right"><p className="font-display text-sm font-semibold">{formatCop(product.price)}</p>{product.compareAtPrice && <p className="text-xs text-slate-400 line-through">{formatCop(product.compareAtPrice)}</p>}</div>
        </div>
        <Link href={`/producto/${product.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-accent">Ver detalle <ArrowUpRight size={14} /></Link>
      </article>
    </SpotlightCard>
  );
}
