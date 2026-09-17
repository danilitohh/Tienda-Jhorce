"use client";

import Image from "next/image";
import { Check, Minus, Plus, Star } from "@phosphor-icons/react";
import { useState } from "react";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { useCart } from "@/components/cart/cart-provider";
import { getCategoryLabel, getColorLabel } from "@/lib/catalog-labels";
import { formatCop } from "@/lib/format";

// Product detail owns variant selection and adds a fully specified product to the cart.
export function ProductDetails({ product }: Readonly<{ product: StoreProduct }>) {
  const [image, setImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] ?? product.sizes?.[0] ?? "Única");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  // Add the selected line and provide a small confirmation without interrupting the flow.
  // Add the selected variant and quantity while keeping pricing owned by the catalog and checkout layers.
  const handleAdd = () => { for (let index = 0; index < quantity; index += 1) addItem(product, { size: product.sizes ? selectedSize : undefined, color: product.colors ? selectedColor : undefined }); setAdded(true); window.setTimeout(() => setAdded(false), 2200); };

  const colorLabel = getColorLabel(product.category);

  return <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
    <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
      <div className="order-2 grid grid-cols-2 gap-3 sm:order-1 sm:grid-cols-1"><button onClick={() => setImage(product.image)} className={`relative aspect-[4/5] overflow-hidden rounded-[8px] bg-sand ${image === product.image ? "ring-2 ring-accent-deep ring-offset-2" : ""}`} aria-label="Ver primera imagen"><Image src={product.image} alt="" fill sizes="90px" className="object-cover" /></button><button onClick={() => setImage(product.secondaryImage)} className={`relative aspect-[4/5] overflow-hidden rounded-[8px] bg-sand ${image === product.secondaryImage ? "ring-2 ring-accent-deep ring-offset-2" : ""}`} aria-label="Ver segunda imagen"><Image src={product.secondaryImage} alt="" fill sizes="90px" className="object-cover" /></button></div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[10px] bg-sand sm:order-2"><Image src={image} alt={`Imagen de referencia de ${product.name}`} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" /></div>
    </div>
    <div className="lg:py-8"><div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-muted"><span>{getCategoryLabel(product.category)}</span><span aria-hidden="true">/</span><span>byjhor</span></div><h1 className="mt-4 font-display text-5xl font-semibold leading-[.92] tracking-[-.03em] sm:text-6xl">{product.name}</h1><div className="mt-5 flex items-center gap-3"><span className="font-body text-lg font-semibold tabular-nums">{formatCop(product.price)}</span>{product.compareAtPrice && <span className="text-sm text-muted line-through">{formatCop(product.compareAtPrice)}</span>}<span className="ml-auto flex items-center gap-1 text-sm"><Star size={16} weight="fill" className="text-accent" /> {product.rating} <span className="text-muted">({product.reviewCount})</span></span></div><p className="mt-6 max-w-md text-[15px] leading-7 text-muted">{product.description}</p>
      {product.sizes && <div className="mt-9"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.16em]">Largo</p><span className="text-xs text-muted">Selecciona una opción</span></div><div className="flex flex-wrap gap-2">{product.sizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size} aria-label={`Elegir largo ${size}`} className={`min-w-12 rounded-[8px] border px-4 py-3 text-sm transition-colors ${selectedSize === size ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"}`}>{size}</button>)}</div></div>}
      {product.colors && <div className="mt-7"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em]">{colorLabel} <span className="font-normal normal-case tracking-normal text-muted">{selectedColor}</span></p><div className="flex flex-wrap gap-2">{product.colors.map((color, index) => <button key={color} onClick={() => setSelectedColor(color)} aria-pressed={selectedColor === color} aria-label={`Elegir ${colorLabel.toLowerCase()} ${color}`} className={`flex items-center gap-2 rounded-[8px] border px-3 py-2 text-xs transition-colors ${selectedColor === color ? "border-ink" : "border-transparent hover:border-ink/30"}`}><span className={`h-5 w-5 rounded-full border border-ink/10 ${index === 0 ? "bg-ink" : "bg-sand"}`} />{color}</button>)}</div></div>}
      <div className="mt-9 flex gap-3"><div className="flex items-center rounded-[8px] border border-ink/15"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3 transition-colors hover:bg-sand" aria-label="Disminuir cantidad"><Minus size={15} /></button><span className="w-8 text-center text-sm tabular-nums">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="p-3 transition-colors hover:bg-sand" aria-label="Aumentar cantidad"><Plus size={15} /></button></div><button onClick={handleAdd} className="button-primary flex-1">{added ? <><Check size={18} /> Añadido al carrito</> : "Añadir al carrito"}</button></div>
      <div className="mt-7 grid gap-3 border-t border-ink/10 pt-6 text-xs text-muted"><p className="flex items-center gap-2"><Check size={15} className="text-success" /> Envío gratis desde $250.000</p><p className="flex items-center gap-2"><Check size={15} className="text-success" /> Cambios fáciles durante 30 días</p><p className="flex items-center gap-2"><Check size={15} className="text-success" /> Compra protegida y confirmación por email</p></div>
    </div>
  </div>;
}
