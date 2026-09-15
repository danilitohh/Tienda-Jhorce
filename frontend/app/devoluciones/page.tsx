import Link from "next/link";

// Return policy placeholder keeps the customer support navigation complete for the first increment.
export default function ReturnsPage() {
  return <main className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-16 sm:px-8 lg:py-24"><Link href="/" className="text-sm text-slate-500 hover:text-ink">← Volver a Jhorce</Link><h1 className="mt-16 font-display text-5xl font-bold tracking-[-.08em]">Cambios y devoluciones</h1><p className="mt-6 text-sm leading-7 text-slate-600">Podrás solicitar cambios dentro de los 30 días posteriores a la entrega. La política completa, excepciones y pasos de aprobación se publicarán aquí y también quedarán reflejados en el flujo de pedidos.</p></main>;
}

