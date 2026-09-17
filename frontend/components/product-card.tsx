"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { useCart } from "@/components/cart/cart-provider";
import { getCategoryLabel, getColorLabel } from "@/lib/catalog-labels";
import { formatCop } from "@/lib/format";

// Product cards use a compact commerce pattern with one consistently aligned action per catalog item.
export function ProductCard({ product }: Readonly<{ product: StoreProduct }>) {
  const { addItem } = useCart();
  const hasOptions = Boolean(product.sizes?.length || product.colors?.length);

  return (
    <article className="group flex h-full flex-col rounded-[10px] border border-warm-line bg-surface p-1.5 shadow-[0_8px_22px_rgba(71,48,23,0.035)] transition-shadow duration-200 hover:shadow-[0_12px_26px_rgba(71,48,23,0.08)] sm:p-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-gold-pale">
        <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`} className="relative block h-full w-full">
          <Image src={product.image} alt={`Imagen de referencia de ${product.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
        </Link>
      </div>
      <div className="flex min-h-[7.8rem] flex-1 items-end justify-between gap-3 px-2 pb-2 pt-3 sm:min-h-[8.6rem] sm:pt-4">
        <div className="self-stretch">
          <p className="text-[0.62rem] font-bold uppercase tracking-[.15em] text-gold-deep">{getCategoryLabel(product.category)}</p>
          <Link href={`/producto/${product.slug}`} className="mt-1.5 block font-display text-[1.22rem] font-semibold leading-[.95] tracking-[-.02em] transition-colors hover:text-gold-deep sm:text-[1.4rem]">{product.name}</Link>
          <p className="mt-2 text-xs text-muted">{product.colors?.length ? `${getColorLabel(product.category)}: ${product.colors[0]}` : "Accesorio de cuidado"}</p>
          {product.badge && <p className="mt-1.5 text-[0.68rem] font-medium text-gold-deep">{product.badge}</p>}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 self-end">
          <div className="text-right">
            <p className="font-body text-sm font-semibold tabular-nums">{formatCop(product.price)}</p>
            {product.compareAtPrice && <p className="mt-1 text-xs text-muted line-through">{formatCop(product.compareAtPrice)}</p>}
          </div>
          {hasOptions ? <Link href={`/producto/${product.slug}`} className="card-action" aria-label={`Elegir opciones de ${product.name}`}><Plus size={18} /><span className="sr-only">Elegir opciones</span></Link> : <button onClick={() => addItem(product)} className="card-action" aria-label={`Añadir ${product.name} al carrito`}><Plus size={18} /></button>}
        </div>
      </div>
    </article>
  );
}
