import Image from "next/image";

type BrandLogoProps = {
  variant?: "header" | "footer";
  priority?: boolean;
  className?: string;
};

// Render the supplied horizontal artwork in the header and keep the complete mark for the footer.
export function BrandLogo({ variant = "header", priority = false, className = "" }: Readonly<BrandLogoProps>) {
  const isFooter = variant === "footer";
  const dimensions = isFooter ? { width: 152, height: 152 } : { width: 160, height: 107 };
  const defaultClassName = isFooter ? "h-24 w-24 object-contain object-left" : "h-20 w-32 object-contain sm:h-24 sm:w-36";
  const source = isFooter ? "/brand/logo-byjhor.png" : "/brand/logo-horizontal.png";

  return <Image src={source} alt="byjhor" width={dimensions.width} height={dimensions.height} priority={priority} className={`${defaultClassName} ${className}`} />;
}
