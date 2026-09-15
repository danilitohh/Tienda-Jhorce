import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Crear cuenta", description: "Crea tu cuenta Jhorce." };

// Registration is isolated from the marketing motion layer to keep account creation frictionless.
export default function SignupPage() { return <main className="grid min-h-[100dvh] place-items-center bg-paper px-5 py-12"><div className="w-full max-w-2xl"><SignupForm /></div></main>; }

