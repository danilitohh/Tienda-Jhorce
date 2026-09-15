import type { Metadata } from "next";
import { CartSummary } from "@/components/cart/cart-summary";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Carrito", description: "Revisa tus piezas Jhorce antes de continuar." };

// Keep the cart route intentionally calm and task-focused, without marketing motion.
export default function CartPage() {
  return <><SiteHeader /><main className="mx-auto min-h-[65vh] max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20"><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">Tu selección</p><h1 className="mt-5 font-display text-5xl font-bold tracking-[-.08em]">Carrito</h1><div className="mt-12"><CartSummary /></div></main><SiteFooter /></>;
}

