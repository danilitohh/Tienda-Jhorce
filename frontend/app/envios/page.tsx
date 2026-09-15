import Link from "next/link";

// Shipping page explains the manual carrier integration honestly until admin tracking is connected.
export default function ShippingPage() {
  return <main className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-16 sm:px-8 lg:py-24"><Link href="/" className="text-sm text-slate-500 hover:text-ink">← Volver a Jhorce</Link><h1 className="mt-16 font-display text-5xl font-bold tracking-[-.08em]">Envíos</h1><p className="mt-6 text-sm leading-7 text-slate-600">Enviamos a Colombia con seguimiento manual de Interrapidísimo. Cuando tu pedido salga, recibirás el número de guía y podrás rastrearlo en el portal público de la transportadora.</p></main>;
}

