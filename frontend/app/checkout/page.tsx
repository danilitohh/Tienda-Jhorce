import Link from "next/link";
import { ArrowLeft, LockKey } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Checkout placeholder makes the next integration boundary explicit while keeping payments outside marketing UI.
export default function CheckoutPage() {
  return <><SiteHeader /><main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-16 sm:px-8 lg:py-24"><Link href="/carrito" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-ink"><ArrowLeft size={16} /> Volver al carrito</Link><div className="mt-12 border border-ink/10 bg-white p-6 sm:p-10"><div className="flex items-center gap-3"><LockKey size={21} className="text-accent" /><p className="text-xs font-bold uppercase tracking-[.16em]">Checkout seguro</p></div><h1 className="mt-6 font-display text-4xl font-bold tracking-[-.07em]">Listos para confirmar tu pedido.</h1><p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">El siguiente paso conectará tu carrito con la reserva temporal de stock, dirección de entrega y el pago mock. Ningún dato de tarjeta se almacena.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/login" className="flex items-center justify-center border border-ink/20 px-5 py-3.5 text-sm font-semibold hover:border-ink">Iniciar sesión</Link><button disabled className="bg-ink px-5 py-3.5 text-sm font-semibold text-white opacity-60">Continuar como invitado próximamente</button></div></div></main><SiteFooter /></>;
}

