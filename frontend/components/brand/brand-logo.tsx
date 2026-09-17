import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer";
  priority?: boolean;
  className?: string;
};

// Render the supplied brand artwork without redrawing or recoloring its lettering.
export function BrandLogo({ variant = "header", priority = false, className = "" }: Readonly<BrandLogoProps>) {
  const dimensions = variant === "footer" ? { width: 152, height: 152 } : { width: 88, height: 88 };
  const defaultClassName = variant === "footer" ? "h-24 w-24 object-contain object-left" : "h-[4.5rem] w-[4.5rem] object-contain sm:h-20 sm:w-20";

  return <Image src="/brand/logo-byjhor.png" alt="byjhor" width={dimensions.width} height={dimensions.height} priority={priority} className={`${defaultClassName} ${className}`} />;
}
