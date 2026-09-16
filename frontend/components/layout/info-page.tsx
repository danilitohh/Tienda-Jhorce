import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type InfoPageProps = {
  title: string;
  children: React.ReactNode;
};

// Give support and legal routes the same branded shell without changing their content or URLs.
export function InfoPage({ title, children }: Readonly<InfoPageProps>) {
  return <><SiteHeader /><main className="site-shell min-h-[65vh] py-14 sm:py-20 lg:py-24"><Link href="/" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"><ArrowLeft size={16} /> Volver a byjhor</Link><div className="mt-14 max-w-3xl"><p className="eyebrow">byjhor</p><h1 className="mt-5 font-display text-6xl font-semibold leading-[.9] tracking-[-.04em]">{title}</h1><div className="mt-8 text-[15px] leading-7 text-muted">{children}</div></div></main><SiteFooter /></>;
}
