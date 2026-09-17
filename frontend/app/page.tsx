import { PRODUCTS } from "@backend/catalog/catalog-data";
import { BenefitStrip } from "@/components/home/benefit-strip";
import { BrandStory } from "@/components/home/brand-story";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ShoppingAssistance } from "@/components/home/shopping-assistance";
import { StoreHero } from "@/components/home/store-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

// Compose the storefront from focused sections so the commercial browsing flow remains easy to evolve.
export default function HomePage() {
  const heroProduct = PRODUCTS[2];
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <StoreHero product={heroProduct} />
        <BenefitStrip />
        <CategoryGrid products={PRODUCTS} />
        <FeaturedProducts products={featuredProducts} />
        <BrandStory />
        <ShoppingAssistance />
      </main>
      <SiteFooter />
    </>
  );
}
