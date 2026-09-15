"use client";

// A local React Bits-style visual primitive kept isolated from commerce logic and checkout surfaces.
export function AuroraOrbit() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[-12%] top-[-18%] h-[34rem] w-[34rem] rounded-full border border-white/15 animate-pulse-ring" />
      <div className="absolute right-[4%] top-[7%] h-[22rem] w-[22rem] rounded-full border border-white/20 animate-drift" />
      <div className="absolute right-[12%] top-[15%] h-[10rem] w-[10rem] rounded-full bg-accent/80 blur-3xl animate-drift" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_60%_35%,rgba(40,85,255,.24),transparent_40%)]" />
    </div>
  );
}

