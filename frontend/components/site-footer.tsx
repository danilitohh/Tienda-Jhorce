import Link from "next/link";
import { InstagramLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/brand/brand-logo";
import { categoryLabels } from "@/lib/catalog-labels";

// The footer closes the storefront with essential navigation, contact context and a quiet yellow accent.
export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper text-ink">
      <div className="site-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="byjhor, inicio"><BrandLogo variant="footer" /></Link>
          <p className="mt-5 max-w-xs text-sm leading-6 text-muted">Pelucas y accesorios para expresarte a tu manera. Diseñados en Colombia.</p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a href="https://www.instagram.com/jhorce.co/" target="_blank" rel="noreferrer" aria-label="Instagram de byjhor" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold-deep"><InstagramLogo size={19} weight="light" /> Instagram</a>
            <span className="flex items-center gap-2 text-xs text-muted"><MapPin size={15} /> Bogotá, CO</span>
          </div>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-ink/45">Explora</p>
          <div className="grid gap-3 text-sm text-muted"><Link href="/catalogo" className="transition-colors hover:text-gold-deep">Tienda</Link><Link href="/catalogo?category=Esenciales" className="transition-colors hover:text-gold-deep">{categoryLabels.Esenciales}</Link><Link href="/catalogo?category=Movimiento" className="transition-colors hover:text-gold-deep">{categoryLabels.Movimiento}</Link><Link href="/catalogo?category=Accesorios" className="transition-colors hover:text-gold-deep">{categoryLabels.Accesorios}</Link></div>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-ink/45">Ayuda</p>
          <div className="grid gap-3 text-sm text-muted"><Link href="/contacto" className="transition-colors hover:text-gold-deep">Contacto</Link><Link href="/envios" className="transition-colors hover:text-gold-deep">Envíos y cambios</Link><Link href="/preguntas" className="transition-colors hover:text-gold-deep">Preguntas frecuentes</Link></div>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-ink/45">Legal</p>
          <div className="grid gap-3 text-sm text-muted"><Link href="/terminos" className="transition-colors hover:text-gold-deep">Términos</Link><Link href="/privacidad" className="transition-colors hover:text-gold-deep">Privacidad</Link><Link href="/devoluciones" className="transition-colors hover:text-gold-deep">Devoluciones</Link></div>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="site-shell flex flex-col gap-2 py-5 text-xs text-ink/50 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} byjhor. Todos los derechos reservados.</span><span>Hecho con intención.</span></div>
      </div>
    </footer>
  );
}
