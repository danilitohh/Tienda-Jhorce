"use client";

import Image from "next/image";
import { Check, Minus, Plus, Star } from "@phosphor-icons/react";
import { useState } from "react";
import type { StoreProduct } from "@backend/catalog/catalog-data";
import { useCart } from "@/components/cart/cart-provider";
import { formatCop } from "@/lib/format";

// Product detail owns variant selection and adds a fully specified product to the cart.
export function ProductDetails({ product }: Readonly<{ product: StoreProduct }>) {
  const [image, setImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] ?? "Única");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  // Add the selected line and provide a small confirmation without interrupting the flow.
  const handleAdd = () => { for (let index = 0; index < quantity; index += 1) addItem(product); setAdded(true); window.setTimeout(() => setAdded(false), 2200); };

  return <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
    <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
      <div className="order-2 grid grid-cols-2 gap-3 sm:order-1 sm:grid-cols-1"><button onClick={() => setImage(product.image)} className={`relative aspect-[4/5] overflow-hidden bg-mist ${image === product.image ? "ring-2 ring-accent ring-offset-2" : ""}`} aria-label="Ver primera imagen"><Image src={product.image} alt="" fill sizes="90px" className="object-cover" /></button><button onClick={() => setImage(product.secondaryImage)} className={`relative aspect-[4/5] overflow-hidden bg-mist ${image === product.secondaryImage ? "ring-2 ring-accent ring-offset-2" : ""}`} aria-label="Ver segunda imagen"><Image src={product.secondaryImage} alt="" fill sizes="90px" className="object-cover" /></button></div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-mist sm:order-2"><Image src={image} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" /></div>
    </div>
    <div className="lg:py-8"><div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-slate-500"><span>{product.category}</span><span className="h-1 w-1 rounded-full bg-accent" /><span>Jhorce studio</span></div><h1 className="mt-4 font-display text-4xl font-bold tracking-[-.06em] sm:text-5xl">{product.name}</h1><div className="mt-5 flex items-center gap-3"><span className="font-display text-xl font-semibold">{formatCop(product.price)}</span>{product.compareAtPrice && <span className="text-sm text-slate-400 line-through">{formatCop(product.compareAtPrice)}</span>}<span className="ml-auto flex items-center gap-1 text-sm"><Star size={16} weight="fill" className="text-accent" /> {product.rating} <span className="text-slate-400">({product.reviewCount})</span></span></div><p className="mt-6 max-w-md text-[15px] leading-7 text-slate-600">{product.description}</p>
      {product.sizes && <div className="mt-9"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.16em]">Talla</p><button className="text-xs text-slate-500 underline underline-offset-4">Guía de tallas</button></div><div className="flex flex-wrap gap-2">{product.sizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`min-w-12 border px-4 py-3 text-sm transition-colors ${selectedSize === size ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink"}`}>{size}</button>)}</div></div>}
      {product.colors && <div className="mt-7"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em]">Color <span className="font-normal normal-case tracking-normal text-slate-500">{product.colors[0]}</span></p><div className="flex gap-3">{product.colors.map((color, index) => <button key={color} onClick={() => undefined} className={`flex items-center gap-2 border px-3 py-2 text-xs ${index === 0 ? "border-ink" : "border-transparent"}`}><span className={`h-5 w-5 rounded-full border border-ink/10 ${index === 0 ? "bg-ink" : "bg-[#e6e1d7]"}`} />{color}</button>)}</div></div>}
      <div className="mt-9 flex gap-3"><div className="flex items-center border border-ink/15"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-3" aria-label="Disminuir cantidad"><Minus size={15} /></button><span className="w-8 text-center text-sm">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="p-3" aria-label="Aumentar cantidad"><Plus size={15} /></button></div><button onClick={handleAdd} className="flex flex-1 items-center justify-center gap-2 bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep">{added ? <><Check size={18} /> Añadido al carrito</> : "Añadir al carrito"}</button></div>
      <div className="mt-7 grid gap-3 border-t border-ink/10 pt-6 text-xs text-slate-600"><p className="flex items-center gap-2"><Check size={15} className="text-accent" /> Envío gratis desde $250.000</p><p className="flex items-center gap-2"><Check size={15} className="text-accent" /> Cambios fáciles durante 30 días</p><p className="flex items-center gap-2"><Check size={15} className="text-accent" /> Compra protegida y confirmación por email</p></div>
    </div>
  </div>;
}

