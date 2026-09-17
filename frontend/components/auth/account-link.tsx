"use client";

import Link from "next/link";
import { User } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getClientSession } from "@/lib/auth-client";

type AccountLinkProps = Readonly<{ className: string; compact?: boolean; showLabel?: boolean; onNavigate?: () => void }>;

// Adapt the global header after hydration while keeping the initial anonymous link usable during slow connections.
export function AccountLink({ className, compact = false, showLabel = false, onNavigate }: AccountLinkProps) {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getClientSession().then((user) => {
      if (active) setFirstName(user?.firstName ?? null);
    });
    return () => { active = false; };
  }, []);

  const authenticated = Boolean(firstName);
  const label = authenticated ? (compact ? "Mi cuenta" : firstName as string) : "Cuenta";
  return <Link className={className} href={authenticated ? "/cuenta" : "/login"} aria-label="Mi cuenta" onClick={onNavigate}><User size={compact ? 22 : 20} weight="light" />{!compact && <span className={showLabel ? "text-sm font-medium" : "hidden text-sm font-medium 2xl:inline"}>{label}</span>}</Link>;
}
