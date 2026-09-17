import Link from "next/link";

// Provide a calm recovery path for invalid product or static routes.
export default function NotFound() {
  return <main className="grid min-h-[100dvh] place-items-center bg-paper px-5 text-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">404</p><h1 className="mt-5 font-display text-5xl font-bold tracking-[-.08em]">Esta peluca no existe.</h1><p className="mt-4 text-sm text-muted">Pero todavía hay mucho por descubrir.</p><Link href="/catalogo" className="mt-7 inline-flex bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">Volver a la tienda</Link></div></main>;
}
