import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Crear cuenta", description: "Crea tu cuenta byjhor." };

// Registration is isolated from the marketing motion layer to keep account creation frictionless.
export default function SignupPage() { return <><SiteHeader /><main className="site-shell grid min-h-[65vh] place-items-center py-14 sm:py-20"><div className="w-full max-w-2xl"><SignupForm /></div></main><SiteFooter /></>; }
