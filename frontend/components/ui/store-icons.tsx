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

// These bespoke discovery icons keep the hair-care language consistent without adding image assets.
export function StoreLengthIcon({ size = 24, className = "" }: StoreIconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M7.5 3.5C4.5 6 4.5 8.5 7.5 11s3 5 0 7.5S4.5 21 7.5 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    <path d="M12 3.5C9 6 9 8.5 12 11s3 5 0 7.5S9 21 12 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    <path d="M16.5 3.5C13.5 6 13.5 8.5 16.5 11s3 5 0 7.5-3 2.5 0 2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
  </svg>;
}

// A compact palette denotes tone selection while remaining recognizable at small sizes.
export function StoreToneIcon({ size = 24, className = "" }: StoreIconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M12 3.25a8.75 8.75 0 0 0 0 17.5h1.1c1.4 0 2.2-1.52 1.42-2.68-.54-.8.03-1.9.99-1.9h.99A4.25 4.25 0 0 0 20.75 12 8.75 8.75 0 0 0 12 3.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    <circle cx="7.6" cy="11.25" fill="currentColor" r="1.15" /><circle cx="10.15" cy="7.7" fill="currentColor" r="1.15" /><circle cx="14.35" cy="7.65" fill="currentColor" r="1.15" /><circle cx="16.65" cy="11.25" fill="currentColor" r="1.15" />
  </svg>;
}

// A three-petal flower gives the care benefit a softer, product-appropriate symbol.
export function StoreCareIcon({ size = 24, className = "" }: StoreIconProps) {
  return <svg aria-hidden="true" className={className} fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <path d="M12 20.75V11.2M8 20.75h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    <path d="M12 14.15c-3.6-.25-6.35-2.55-7.1-5.85 3.58-.28 6.45 1.38 7.1 5.85ZM12 14.15c3.6-.25 6.35-2.55 7.1-5.85-3.58-.28-6.45 1.38-7.1 5.85ZM12 12.1c-2.25-2.48-2.15-5.78 0-8.1 2.15 2.32 2.25 5.62 0 8.1Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
  </svg>;
}
