"use client";

import Link from "next/link";
import { Bag, List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { BrandLogo } from "@/components/brand/brand-logo";
import { categoryLabels } from "@/lib/catalog-labels";

const navLinks = [
  { label: "Tienda", href: "/catalogo" },
  { label: categoryLabels.Esenciales, href: "/catalogo?category=Esenciales" },
  { label: categoryLabels.Movimiento, href: "/catalogo?category=Movimiento" },
  { label: categoryLabels.Accesorios, href: "/catalogo?category=Accesorios" },
  { label: "Sobre byjhor", href: "/#historia" },
] as const;

// The site header keeps the supplied mark visible while preserving compact desktop and mobile navigation.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
    <div className="site-shell flex min-h-16 items-center justify-between">
      <Link href="/" aria-label="byjhor, inicio" className="shrink-0">
        <BrandLogo priority className="h-14 w-14" />
      </Link>
      <nav className="hidden items-center gap-7 text-sm font-medium lg:flex" aria-label="Navegación principal">
        {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-ink/75 transition-colors hover:text-accent-deep">{link.label}</Link>)}
      </nav>
      <div className="flex items-center gap-1 sm:gap-2">
        <Link href="/catalogo" className="rounded-[9px] p-2 text-ink transition-colors hover:bg-white hover:text-accent-deep" aria-label="Buscar productos"><MagnifyingGlass size={20} weight="light" /></Link>
        <Link className="hidden rounded-[9px] p-2 text-ink transition-colors hover:bg-white hover:text-accent-deep sm:block" href="/login" aria-label="Mi cuenta"><span className="text-sm font-medium">Cuenta</span></Link>
        <Link className="relative rounded-[9px] p-2 text-ink transition-colors hover:bg-white hover:text-accent-deep" href="/carrito" aria-label={`Carrito con ${itemCount} productos`}><Bag size={21} weight="light" />{itemCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">{itemCount}</span>}</Link>
        <button className="rounded-[9px] p-2 text-ink transition-colors hover:bg-white lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>{open ? <X size={21} /> : <List size={21} />}</button>
      </div>
    </div>
    {open && <nav id="mobile-navigation" className="border-t border-ink/10 bg-paper lg:hidden" aria-label="Navegación móvil"><div className="site-shell grid gap-1 py-3 text-sm"><Link className="rounded-[8px] px-3 py-3 hover:bg-white" href="/login" onClick={() => setOpen(false)}>Cuenta</Link>{navLinks.map((link) => <Link key={link.href} className="rounded-[8px] px-3 py-3 hover:bg-white" href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div></nav>}
  </header>;
}
