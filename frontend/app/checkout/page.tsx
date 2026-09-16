import Link from "next/link";
import { ArrowLeft, LockKey } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Checkout placeholder makes the next integration boundary explicit while keeping payments outside marketing UI.
export default function CheckoutPage() {
  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-16 lg:py-24"><Link href="/carrito" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"><ArrowLeft size={16} /> Volver al carrito</Link><div className="surface-panel mx-auto mt-12 max-w-3xl p-6 sm:p-10"><div className="flex items-center gap-3"><LockKey size={21} className="text-success" /><p className="eyebrow text-ink">Checkout seguro</p></div><h1 className="mt-6 font-display text-5xl font-semibold leading-[.92] tracking-[-.03em]">Listos para confirmar tu pedido.</h1><p className="mt-4 max-w-lg text-sm leading-7 text-muted">El siguiente paso conectará tu carrito con la reserva temporal de stock, dirección de entrega y el pago mock. Ningún dato de tarjeta se almacena.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/login" className="button-secondary">Iniciar sesión</Link><button disabled className="button-primary cursor-not-allowed opacity-60">Continuar como invitado próximamente</button></div></div></main><SiteFooter /></>;
}
