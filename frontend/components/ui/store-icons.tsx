type StoreIconProps = Readonly<{
  size?: number;
  className?: string;
}>;

// Shared search icon uses a deliberate stroke and geometry so small controls stay legible.
export function StoreSearchIcon({ size = 20, className = "" }: StoreIconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <circle cx="10.75" cy="10.75" r="5.75" stroke="currentColor" strokeWidth="1.8" />
    <path d="m15 15 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>;
}

// Shared bag icon gives the cart a recognizable silhouette without relying on a tiny glyph.
export function StoreBagIcon({ size = 22, className = "" }: StoreIconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M5.25 8.5h13.5l-.75 10.25H6L5.25 8.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    <path d="M8.5 8.25V6.75a3.5 3.5 0 0 1 7 0v1.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>;
}
