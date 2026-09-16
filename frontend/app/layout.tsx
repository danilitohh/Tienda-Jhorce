import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", display: "swap", weight: ["500", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

// Global metadata establishes the byjhor SEO contract for the Vercel deployment.
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "byjhor | Tu esencia. Tu estilo.", template: "%s | byjhor" },
  description: "Prendas y accesorios para expresarte a tu manera.",
  openGraph: { title: "byjhor | Tu esencia. Tu estilo.", description: "Prendas y accesorios para expresarte a tu manera.", type: "website" },
};

// The root layout owns font loading and the cart context shared by all storefront surfaces.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${cormorantGaramond.variable} ${dmSans.variable} bg-paper font-body text-ink antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
