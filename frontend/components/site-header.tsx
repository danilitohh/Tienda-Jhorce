"use client";

import Link from "next/link";
import { Bag, List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

// The site header provides one-line desktop navigation and a compact mobile disclosure.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="relative z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="font-display text-[1.45rem] font-bold tracking-[-.08em]" aria-label="Jhorce, inicio">JHORCE<span className="text-accent">.</span></Link>
        <nav className="hidden items-center gap-8 text-[13px] font-medium lg:flex" aria-label="Navegación principal">
          <Link className="transition-colors hover:text-accent" href="/catalogo">Tienda</Link>
          <Link className="transition-colors hover:text-accent" href="/catalogo?category=Movimiento">Movimiento</Link>
          <Link className="transition-colors hover:text-accent" href="/catalogo?category=Accesorios">Accesorios</Link>
          <Link className="transition-colors hover:text-accent" href="/#historia">Nuestra mirada</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden p-2 text-ink transition-colors hover:text-accent sm:block" aria-label="Buscar"><MagnifyingGlass size={21} weight="light" /></button>
          <Link className="hidden p-2 text-ink transition-colors hover:text-accent sm:block" href="/login" aria-label="Mi cuenta"><span className="text-xs font-medium">Cuenta</span></Link>
          <Link className="relative p-2 text-ink transition-colors hover:text-accent" href="/carrito" aria-label={`Carrito con ${itemCount} productos`}><Bag size={22} weight="light" />{itemCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{itemCount}</span>}</Link>
          <button className="p-2 lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((current) => !current)}>{open ? <X size={22} /> : <List size={22} />}</button>
        </div>
      </div>
      {open && <nav className="border-t border-ink/10 bg-paper px-5 py-4 lg:hidden" aria-label="Navegación móvil"><div className="grid gap-4 text-sm"><Link href="/catalogo" onClick={() => setOpen(false)}>Tienda</Link><Link href="/catalogo?category=Movimiento" onClick={() => setOpen(false)}>Movimiento</Link><Link href="/catalogo?category=Accesorios" onClick={() => setOpen(false)}>Accesorios</Link><Link href="/login" onClick={() => setOpen(false)}>Cuenta</Link></div></nav>}
    </header>
  );
}

