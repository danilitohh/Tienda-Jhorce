import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

// The brand section uses the supplied portrait and concise real positioning instead of invented brand history.
export function BrandStory() {
  return (
    <section id="historia" className="scroll-mt-28 border-b border-ink/10 bg-gold-pale/55 py-14 sm:py-20 lg:py-24">
      <div className="site-shell grid items-center gap-9 lg:grid-cols-[.86fr_1.14fr] lg:gap-20">
        <figure className="relative m-0 aspect-[4/5] overflow-hidden rounded-[12px] bg-gold-soft">
          <Image src="/brand/about-byjhor.png" alt="Retrato editorial de una mujer con cabello afro" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
        </figure>
        <div className="max-w-2xl lg:py-8">
          <p className="eyebrow">Sobre ByJhor</p>
          <h2 className="section-title mt-4 text-5xl sm:text-7xl">Tu cabello.<br />Tus reglas.</h2>
          <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted">byjhor reúne pelucas y accesorios para que elegir cómo verte sea una decisión tuya.</p>
          <Link href="/catalogo" className="text-link mt-8">Conoce la colección <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
