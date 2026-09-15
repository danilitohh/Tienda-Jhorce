import Link from "next/link";

// Privacy content placeholder reserves the public route required by the commerce brief.
export default function PrivacyPage() {
  return <main className="mx-auto min-h-[100dvh] max-w-3xl px-5 py-16 sm:px-8 lg:py-24"><Link href="/" className="text-sm text-slate-500 hover:text-ink">← Volver a Jhorce</Link><h1 className="mt-16 font-display text-5xl font-bold tracking-[-.08em]">Política de privacidad</h1><p className="mt-6 text-sm leading-7 text-slate-600">Esta página documentará el tratamiento de datos personales, consentimiento, derechos del titular y canales de atención de Jhorce. Debe completarse con la política legal aprobada antes del lanzamiento.</p></main>;
}

