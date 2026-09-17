import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer";
  priority?: boolean;
  className?: string;
};

// Render the supplied brand artwork without redrawing or recoloring its lettering.
export function BrandLogo({ variant = "header", priority = false, className = "" }: Readonly<BrandLogoProps>) {
  const dimensions = variant === "footer" ? { width: 152, height: 152 } : { width: 112, height: 112 };
  const defaultClassName = variant === "footer" ? "h-24 w-24 object-contain object-left" : "h-20 w-20 object-contain sm:h-[6.5rem] sm:w-[6.5rem]";

  return <Image src="/brand/logo-byjhor.png" alt="byjhor" width={dimensions.width} height={dimensions.height} priority={priority} className={`${defaultClassName} ${className}`} />;
}
