import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

// Simple static support page keeps the footer contact destination useful in the first increment.
export default function ContactPage() {
  return <main className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-16 sm:px-8 lg:py-24"><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-ink"><ArrowLeft size={16} /> Volver a Jhorce</Link><h1 className="mt-16 font-display text-5xl font-bold tracking-[-.08em]">Hablemos.</h1><p className="mt-5 max-w-lg text-base leading-7 text-slate-500">Escríbenos a hola@jhorce.co y te responderemos en horario hábil. También puedes encontrarnos en Instagram @jhorce.co.</p></main>;
}

