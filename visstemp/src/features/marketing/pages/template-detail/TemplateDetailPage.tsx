import { Section } from "@/components/layout/section";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import { HeroSection } from "@/features/marketing/pages/templates/components/HeroSection";
import { FeatureList } from "@/features/marketing/pages/template-detail/components/FeatureList";
import { ProductGallery } from "@/features/marketing/pages/template-detail/components/ProductGallery";
import { ProductInfo } from "@/features/marketing/pages/template-detail/components/ProductInfo";
import { RelatedProducts } from "@/features/marketing/pages/template-detail/components/RelatedProducts";
import { AddOnPackagesSection } from "@/components/sections/addon-packages/AddOnPackagesSection";
import {
  getDynamicFeatureGroup,
  getServicePackagesForDetail,
} from "@/features/marketing/pages/template-detail/template-detail.utils";

type TemplateDetailPageProps = {
  item: HomeTemplateItem;
  galleryUrls: string[];
  relatedItems: HomeTemplateItem[];
};

export function TemplateDetailPage({
  item,
  galleryUrls,
  relatedItems,
}: TemplateDetailPageProps) {
  const features = getDynamicFeatureGroup(item);
  const servicePackages = getServicePackagesForDetail();

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection breadcrumbCurrentLabel={item.title} />

      <Section
        spacing="md"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f8ff_0%,#ffffff_42%,#f6fbff_100%)]"
      >
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-10">
          <div className="rounded-2xl border border-[#d7e4f6] bg-white/85 p-4 shadow-sm backdrop-blur-sm sm:p-5">
            <h1 className="text-lg font-extrabold text-[#184983] sm:text-xl">
              {item.title}
            </h1>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <ProductGallery title={item.title} images={galleryUrls} />
            <ProductInfo item={item} />
          </div>

          <FeatureList features={features} />
          <AddOnPackagesSection packages={servicePackages} />
          <RelatedProducts currentId={item.id} items={relatedItems} />
        </div>
      </Section>
    </div>
  );
}
