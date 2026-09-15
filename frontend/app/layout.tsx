import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

// Global metadata establishes the base SEO contract for the Vercel deployment.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Jhorce | Viste lo que te mueve", template: "%s | Jhorce" },
  description: "Esenciales contemporáneos para moverte con libertad. Diseñados en Colombia.",
  openGraph: { title: "Jhorce | Viste lo que te mueve", description: "Prendas y accesorios con intención.", type: "website" },
};

// The root layout owns font loading and the cart context shared by all storefront surfaces.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} bg-paper font-body text-ink antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
