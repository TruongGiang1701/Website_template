import { Footer } from "@/components/shared/footer/Footer";
import { FooterCTA } from "@/components/shared/footer/FooterCTA";

export function MarketingFooter() {
  return (
    <div className="mt-auto">
      <FooterCTA className="relative z-10 -mb-16" />
      <Footer />
    </div>
  );
}
