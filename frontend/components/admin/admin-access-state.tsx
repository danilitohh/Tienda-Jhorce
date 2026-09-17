import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKey, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/brand/brand-logo";

type AccessState = "not-configured" | "unavailable";

const stateCopy: Record<AccessState, Readonly<{ eyebrow: string; title: string; description: string }>> = {
  "not-configured": {
    eyebrow: "Administración protegida",
    title: "Configura el acceso administrativo.",
    description: "Este panel solo se activa con una sesión segura y MongoDB. Mientras tanto, ningún dato de la tienda queda expuesto.",
  },
  unavailable: {
    eyebrow: "Datos no disponibles",
    title: "No pudimos cargar la operación.",
    description: "La sesión está autorizada, pero la conexión administrativa no pudo leer MongoDB. Revisa la configuración antes de continuar.",
  },
};

// A deliberate safe state prevents unconfigured access from seeing store operations.
export function AdminAccessState({ state, message }: Readonly<{ state: AccessState; message?: string }>) {
  const copy = stateCopy[state];

  return (
    <main className="min-h-screen bg-paper px-5 py-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-ink/10 pb-5">
          <Link href="/" aria-label="Volver a la tienda byjhor"><BrandLogo className="h-10 w-28" priority /></Link>
          <Link href="/" className="text-link text-xs">Ver tienda <ArrowLeft size={15} /></Link>
        </header>
        <section className="mx-auto mt-16 max-w-xl surface-panel p-7 sm:mt-24 sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-[10px] bg-gold-pale text-gold-deep"><ShieldCheck size={25} weight="light" /></span>
          <p className="eyebrow mt-8">{copy.eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[.95] tracking-[-.03em] sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 text-sm leading-7 text-muted">{message ?? copy.description}</p>
          {state === "not-configured" && <div className="mt-8 rounded-[8px] border border-gold/35 bg-gold-pale/55 p-4 text-xs leading-6 text-ink"><p className="font-semibold">Configuración necesaria</p><ol className="mt-2 list-decimal space-y-1 pl-4 text-muted"><li>Conserva <code className="rounded bg-white px-1 py-0.5 text-ink">MONGODB_URI</code> solo en Vercel.</li><li>Configura <code className="rounded bg-white px-1 py-0.5 text-ink">ADMIN_USERNAME</code> con el usuario privado de la dueña.</li><li>Configura <code className="rounded bg-white px-1 py-0.5 text-ink">ADMIN_PASSWORD</code> como variable privada, con al menos 8 caracteres.</li></ol></div>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admin/login" className="button-primary">Iniciar sesión <ArrowRight size={17} /></Link>
            <Link href="/" className="button-secondary">Volver a la tienda <LockKey size={16} /></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
