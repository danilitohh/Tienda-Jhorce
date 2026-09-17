import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";

// The closing assistance block offers a real contact route and keeps the decision support modest.
export function ShoppingAssistance() {
  return (
    <section className="bg-paper py-14 sm:py-20 lg:py-24" aria-labelledby="help-title">
      <div className="site-shell grid gap-10 border-y border-ink/15 py-9 sm:py-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:py-16">
        <div>
          <p className="eyebrow">Elige con calma</p>
          <h2 id="help-title" className="section-title mt-4 max-w-2xl">El largo y el tono que imaginas.</h2>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted">
            <p className="flex items-center gap-2"><Check size={17} weight="bold" className="text-gold-deep" /> Largos para explorar</p>
            <p className="flex items-center gap-2"><Check size={17} weight="bold" className="text-gold-deep" /> Tonos para cambiar</p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-7 border-t border-ink/15 pt-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <div>
            <p className="eyebrow">¿Necesitas ayuda?</p>
            <h3 className="mt-3 font-display text-3xl font-semibold leading-[.95] tracking-[-.02em] sm:text-4xl">Te ayudamos a encontrar tu peluca.</h3>
          </div>
          <Link href="/contacto" className="text-link">Escríbenos <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
