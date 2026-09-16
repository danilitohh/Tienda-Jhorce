"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "@phosphor-icons/react";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { useCart } from "@/components/cart/cart-provider";
import { formatCop } from "@/lib/format";

// Product cards keep discovery visual while routing variant-dependent purchases through the detail page.
export function ProductCard({ product }: Readonly<{ product: StoreProduct }>) {
  const { addItem } = useCart();
  const hasOptions = Boolean(product.sizes?.length || product.colors?.length);

  return <article className="group h-full">
    <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-sand">
      <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`} className="relative block h-full w-full">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </Link>
    </div>
    <div className="flex items-start justify-between gap-3 pt-4">
      <div><p className="text-[0.65rem] font-bold uppercase tracking-[.16em] text-accent-deep">{product.category}</p><Link href={`/producto/${product.slug}`} className="mt-2 block font-display text-[1.35rem] font-semibold leading-none tracking-[-.02em] transition-colors hover:text-accent-deep">{product.name}</Link><p className="mt-2 text-xs text-muted">{product.colors?.length ? `Color: ${product.colors[0]}` : "Diseño esencial"}</p>{product.badge && <p className="mt-2 text-xs font-medium text-accent-deep">{product.badge}</p>}</div>
      <div className="text-right"><p className="font-body text-sm font-semibold tabular-nums">{formatCop(product.price)}</p>{product.compareAtPrice && <p className="mt-1 text-xs text-muted line-through">{formatCop(product.compareAtPrice)}</p>}</div>
    </div>
    <div className="mt-4">
      {hasOptions ? <Link href={`/producto/${product.slug}`} className="button-secondary min-h-10 w-full px-3 text-xs">Elegir opciones <ArrowUpRight size={15} /></Link> : <button onClick={() => addItem(product)} className="button-secondary min-h-10 w-full px-3 text-xs" aria-label={`Añadir ${product.name} al carrito`}><Plus size={15} /> Añadir al carrito</button>}
    </div>
  </article>;
}
