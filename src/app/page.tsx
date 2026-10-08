import { HeroCarousel } from "@/components/home/HeroCarousel";
import { PageTransition } from "@/components/motion/PageTransition";
import { MarqueeBand } from "@/components/home/MarqueeBand";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FeaturedRow } from "@/components/home/FeaturedRow";
import { StoryBand } from "@/components/home/StoryBand";
import { WhyShop } from "@/components/home/WhyShop";
import { HowOrdering } from "@/components/home/HowOrdering";
import { LookbookGrid } from "@/components/home/LookbookGrid";
import { VisitStore } from "@/components/home/VisitStore";

export default function HomePage() {
  return (
    <PageTransition>
      <HeroCarousel />
      <MarqueeBand />
      <CategoryTiles />
      <FeaturedRow />
      <StoryBand />
      <WhyShop />
      <HowOrdering />
      <LookbookGrid />
      <VisitStore />
    </PageTransition>
  );
}
