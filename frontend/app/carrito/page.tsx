import type { Metadata } from "next";
import { CartSummary } from "@/components/cart/cart-summary";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Carrito", description: "Revisa tus piezas byjhor antes de continuar." };

// Keep the cart route intentionally calm and task-focused, without marketing motion.
export default function CartPage() {
  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-14 sm:py-20 lg:py-24"><p className="eyebrow">Tu selección</p><h1 className="mt-5 font-display text-6xl font-semibold leading-none tracking-[-.04em]">Carrito</h1><div className="mt-12"><CartSummary /></div></main><SiteFooter /></>;
}
