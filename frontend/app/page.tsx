import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { PRODUCTS } from "@backend/catalog/catalog-data";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategoryLabel } from "@/lib/catalog-labels";

// The homepage presents the real assortment through a quieter editorial storefront focused on discovery.
export default function HomePage() {
  const heroProduct = PRODUCTS[2];
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-ink/10 bg-paper">
          <div className="site-shell grid min-h-[calc(100dvh-6rem)] items-center gap-12 py-12 sm:py-16 lg:grid-cols-[.82fr_1.18fr] lg:gap-20 lg:py-20">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em] text-gold-deep">
                <span className="h-px w-10 bg-gold" aria-hidden="true" />
                <span>Pelucas byjhor</span>
              </div>
              <h1 className="mt-7 max-w-2xl font-display text-[clamp(4.5rem,9vw,8.75rem)] font-semibold leading-[.82] tracking-[-.055em] text-ink">
                Tu esencia,
                <br />
                <span className="text-gold-deep">tu estilo.</span>
              </h1>
              <p className="mt-8 max-w-md text-base leading-7 text-muted sm:text-lg">
                Pelucas y accesorios para cambiar de look con la libertad de hacerlo a tu manera.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link href="/catalogo" className="button-primary">
                  Explorar la colección
                  <ArrowRight size={18} />
                </Link>
                <Link href="/catalogo?category=Accesorios" className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-8 transition-colors hover:text-gold-deep hover:decoration-gold-deep">
                  Ver cuidados
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="mt-16 grid max-w-md grid-cols-3 border-t border-ink/10 pt-5 text-xs leading-5 text-muted">
                <span className="pr-4">Largos para explorar</span>
                <span className="border-l border-ink/10 px-4">Tonos que se sienten tuyos</span>
                <span className="border-l border-ink/10 pl-4">Cuidado diario</span>
              </div>
            </div>

            <figure className="relative m-0 lg:pl-8">
              <div className="absolute -right-10 top-8 hidden h-28 w-28 border border-gold/60 lg:block" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[16px] bg-gold-pale">
                <div className="relative aspect-[4/5] max-h-[46rem] w-full">
                  <Image
                    src={heroProduct.image}
                    alt={`Imagen de ${heroProduct.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 bg-paper/90 p-5 backdrop-blur-[2px] sm:p-6">
                  <div>
                    <p className="eyebrow">{getCategoryLabel(heroProduct.category)}</p>
                    <p className="mt-2 font-display text-2xl font-semibold leading-none">{heroProduct.name}</p>
                  </div>
                  <Link href={`/producto/${heroProduct.slug}`} aria-label={`Ver ${heroProduct.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:border-gold-deep hover:bg-gold hover:text-ink">
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              </div>
              <figcaption className="mt-4 flex items-center justify-between border-b border-ink/15 pb-4 text-sm text-muted">
                <span>Una silueta para moverte</span>
                <span className="tabular-nums">0{PRODUCTS.indexOf(heroProduct) + 1} / 0{PRODUCTS.length}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-b border-ink/10 bg-gold-pale/60">
          <div className="site-shell flex flex-col gap-5 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl font-semibold tracking-[-.02em]">Encuentra el look que ya imaginas.</p>
            <p className="text-muted">Diseños para cada día, cada movimiento y cada ritual de cuidado.</p>
          </div>
        </section>

        <CategoryGrid products={PRODUCTS} />

        <section className="border-y border-ink/10 bg-paper py-20 sm:py-24 lg:py-32" aria-labelledby="seleccion-title">
          <div className="site-shell">
            <div className="flex flex-col gap-6 border-b border-ink/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">La selección byjhor</p>
                <h2 id="seleccion-title" className="section-title mt-4">Pelucas para explorar</h2>
              </div>
              <Link href="/catalogo" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-8 transition-colors hover:text-gold-deep hover:decoration-gold-deep">
                Ver toda la tienda
                <ArrowRight size={17} />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 lg:mt-14 lg:gap-x-7">
              {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>

        <section id="historia" className="scroll-mt-24 border-b border-ink/10 bg-gold-pale py-20 sm:py-24 lg:py-32">
          <div className="site-shell grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-24">
            <figure className="m-0">
              <div className="relative overflow-hidden rounded-[16px] bg-gold p-2.5 sm:p-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-paper">
                  <Image src="/brand/about-byjhor.png" alt="Retrato editorial de una mujer con cabello afro" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
                </div>
              </div>
              <figcaption className="mt-4 flex items-center justify-between border-b border-ink/15 pb-4 text-xs uppercase tracking-[.16em] text-muted">
                <span>Inspiración byjhor</span>
                <span>02</span>
              </figcaption>
            </figure>
            <div className="max-w-xl">
              <p className="eyebrow">Sobre ByJhor</p>
              <h2 className="section-title mt-5 text-5xl sm:text-7xl">Tu cabello.<br />Tus reglas.</h2>
              <p className="mt-8 max-w-lg text-[15px] leading-7 text-muted">byjhor reúne pelucas y accesorios para que elegir cómo verte sea una decisión tuya.</p>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted">Explora largos, tonos y estilos que pueden acompañarte en diferentes momentos.</p>
              <Link href="/catalogo" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-8 transition-colors hover:text-gold-deep hover:decoration-gold-deep">
                Conoce la colección
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="site-shell py-20 sm:py-24 lg:py-32" aria-labelledby="ayuda-title">
          <div className="grid gap-8 rounded-[16px] border border-gold/50 bg-gold-soft/45 p-8 sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:p-16">
            <div>
              <p className="eyebrow">Elige con calma</p>
              <h2 id="ayuda-title" className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[.92] tracking-[-.035em] sm:text-6xl">El largo y el tono que imaginas.</h2>
              <div className="mt-10 grid gap-4 border-t border-ink/15 pt-6 text-sm text-muted sm:grid-cols-2">
                <p className="flex items-center gap-3"><Check size={18} weight="bold" className="text-gold-deep" /> Largos para explorar.</p>
                <p className="flex items-center gap-3"><Check size={18} weight="bold" className="text-gold-deep" /> Tonos para cambiar.</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div>
                <p className="eyebrow">¿Necesitas ayuda?</p>
                <h3 className="mt-4 max-w-sm font-display text-3xl font-semibold leading-[.95] sm:text-4xl">Te ayudamos a encontrar tu peluca.</h3>
              </div>
              <Link href="/contacto" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-8 transition-colors hover:text-gold-deep hover:decoration-gold-deep">
                Escríbenos
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
