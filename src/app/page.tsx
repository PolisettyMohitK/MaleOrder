import { HeroCarousel } from "@/components/home/HeroCarousel";
import { PageTransition } from "@/components/motion/PageTransition";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedRow } from "@/components/home/FeaturedRow";
import { HowOrdering } from "@/components/home/HowOrdering";
import { VisitStore } from "@/components/home/VisitStore";

export default function HomePage() {
  return (
    <PageTransition>
      <HeroCarousel />
      <TrustStrip />
      <CategoryTiles />
      <FeaturedRow />
      <HowOrdering />
      <VisitStore />
    </PageTransition>
  );
}
