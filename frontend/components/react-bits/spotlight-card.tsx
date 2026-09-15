"use client";

import { useState } from "react";

// A lightweight pointer spotlight adds product-card feedback without a heavy motion dependency.
export function SpotlightCard({ children, className = "" }: Readonly<{ children: React.ReactNode; className?: string }>) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Track pointer position only inside this isolated card to keep the rest of the catalog static.
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  };

  return (
    <div onPointerMove={handlePointerMove} className={`group relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(40,85,255,.16), transparent 28%)` }} />
      {children}
    </div>
  );
}

