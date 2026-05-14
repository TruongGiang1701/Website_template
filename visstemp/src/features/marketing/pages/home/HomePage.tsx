import { HeroOption2 } from "@/features/marketing/sections/hero/HeroOption2";
import { ClientsOption2 } from "@/features/marketing/sections/clients/ClientsOption2";
import { LandingHighlightsOption2 } from "@/features/marketing/sections/landing/LandingHighlightsOption2";
import { StatsOption2 } from "@/features/marketing/sections/stats/StatsOption2";
import { TemplateCatalogOption2 } from "@/features/marketing/sections/catalog/TemplateCatalogOption2";
import { RoadmapOption2 } from "@/features/marketing/sections/roadmap/RoadmapOption2";
import { PricingOption2 } from "@/features/marketing/sections/pricing/PricingOption2";
import { ContactShowcaseOption2 } from "@/features/marketing/sections/contact/ContactShowcaseOption2";

/** Trang Home marketing — compose sections + data; không nhét logic tạp vào route. */
export function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroOption2 />
      <ClientsOption2 />
      <LandingHighlightsOption2 />
      <StatsOption2 />
      <TemplateCatalogOption2 />
      <RoadmapOption2 />
      <PricingOption2 />
      <ContactShowcaseOption2 />
    </div>
  );
}
