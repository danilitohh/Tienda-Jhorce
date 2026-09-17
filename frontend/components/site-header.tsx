"use client";

import Link from "next/link";
import { List, Truck, X } from "@phosphor-icons/react";
import { Fragment, useState } from "react";
import { AccountLink } from "@/components/auth/account-link";
import { useCart } from "@/components/cart/cart-provider";
import { BrandLogo } from "@/components/brand/brand-logo";
import { StoreBagIcon, StoreSearchIcon } from "@/components/ui/store-icons";
import { categoryLabels } from "@/lib/catalog-labels";

const navLinks = [
  { label: "Tienda", href: "/catalogo" },
  { label: categoryLabels.Esenciales, href: "/catalogo?category=Esenciales" },
  { label: categoryLabels.Movimiento, href: "/catalogo?category=Movimiento" },
  { label: categoryLabels.Accesorios, href: "/catalogo?category=Accesorios" },
  { label: "Sobre ByJhor", href: "/#historia" },
] as const;

// The header follows a mobile-first commerce pattern while preserving every existing destination.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="border-b border-gold-deep/20 bg-gold text-center text-xs font-semibold text-ink sm:text-sm">
        <p className="site-shell inline-flex items-center justify-center gap-2 py-2"><Truck aria-hidden="true" size={17} weight="regular" />Envío gratis desde $250.000</p>
      </div>
      <div className="site-shell grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 sm:min-h-20 xl:flex xl:justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="rounded-[6px] p-2 text-ink transition-colors hover:bg-gold-pale hover:text-gold-deep xl:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>{open ? <X size={22} /> : <List size={24} />}</button>
          <AccountLink compact className="rounded-[6px] p-2 text-ink transition-colors hover:bg-gold-pale hover:text-gold-deep xl:hidden" />
          <Link href="/" aria-label="byjhor, inicio" className="hidden shrink-0 xl:block"><BrandLogo priority /></Link>
        </div>
        <Link href="/" aria-label="byjhor, inicio" className="shrink-0 xl:hidden"><BrandLogo priority className="h-11 w-28 sm:h-12 sm:w-32" /></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium xl:flex" aria-label="Navegación principal">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-ink/80 transition-colors hover:text-gold-deep">{link.label}</Link>)}
        </nav>
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Link href="/catalogo" className="rounded-[6px] p-2 text-ink transition-colors hover:bg-gold-pale hover:text-gold-deep" aria-label="Buscar productos"><StoreSearchIcon size={21} /></Link>
          <AccountLink className="hidden rounded-[6px] p-2 text-ink transition-colors hover:bg-gold-pale hover:text-gold-deep sm:flex sm:items-center sm:gap-2" />
          <Link className="relative rounded-[6px] p-2 text-ink transition-colors hover:bg-gold-pale hover:text-gold-deep" href="/carrito" aria-label={`Carrito con ${itemCount} productos`}><StoreBagIcon size={23} />{itemCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-deep px-1 text-[10px] font-bold text-white">{itemCount}</span>}</Link>
        </div>
      </div>
      <nav className="border-t border-ink/10 bg-paper xl:hidden" aria-label="Categorías">
        <div className="site-shell flex items-center gap-3 overflow-x-auto py-3 text-xs font-medium whitespace-nowrap [scrollbar-width:none]">
          {navLinks.slice(0, 4).map((link, index) => <Fragment key={link.href}>{index > 0 && <span aria-hidden="true" className="text-gold-deep">•</span>}<Link href={link.href} className="text-ink/75 transition-colors hover:text-gold-deep">{link.label}</Link></Fragment>)}
        </div>
      </nav>
      {open && <nav id="mobile-navigation" className="border-t border-ink/10 bg-paper xl:hidden" aria-label="Menú"><div className="site-shell grid gap-1 py-3 text-sm"><AccountLink showLabel className="flex items-center gap-2 rounded-[6px] px-3 py-3 hover:bg-gold-pale" onNavigate={() => setOpen(false)} />{navLinks.map((link) => <Link key={link.href} className="rounded-[6px] px-3 py-3 hover:bg-gold-pale" href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div></nav>}
    </header>
  );
}
