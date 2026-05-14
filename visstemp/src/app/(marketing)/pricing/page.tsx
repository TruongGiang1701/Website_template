import Image from "next/image";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PricingOption2 } from "@/features/marketing/sections/pricing/PricingOption2";
import { ClientsOption2 } from "@/features/marketing/sections/clients/ClientsOption2";

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Section spacing="sm" withContainer={false} className="py-0">
        <div className="relative">
          <section className="relative overflow-hidden pt-16 sm:pt-20">
            <div className="pointer-events-none absolute inset-0">
              <Image
                src="/images/categories/template_dichvu.jpg"
                alt="Gói dịch vụ VISSTEMP"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(255,255,255,0.22),transparent_36%),linear-gradient(90deg,rgba(235,205,234,0.28)_0%,rgba(243,225,247,0.14)_30%,rgba(255,255,255,0)_70%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
              <div className="flex min-h-[260px] items-center pb-10 pt-10 sm:min-h-[340px] sm:pb-12 sm:pt-12 lg:min-h-[420px] lg:pb-14 lg:pt-14">
                <div className="max-w-[46rem]">
                  <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-[#145a9f] drop-shadow-[0_1px_0_rgba(255,255,255,0.35)] sm:text-5xl lg:text-6xl">
                    Gói thiết kế chuẩn{" "}
                    <span className="bg-gradient-to-r from-[#2a5c98] via-[#7d4f72] to-[#ef4338] bg-clip-text text-transparent">
                      SEO
                    </span>
                  </h1>

                  <p className="mt-6 max-w-2xl text-sm font-extrabold leading-relaxed text-white [text-shadow:0_1px_2px_rgba(24,71,127,0.9)] sm:text-base">
                    VISSTEMP giúp doanh nghiệp sở hữu website nhanh - đẹp - chuẩn SEO,
                    app mượt mà và landing page tối ưu chuyển đổi.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-white/95">
            <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
              <Breadcrumbs />
            </div>
          </div>
        </div>
      </Section>

      <PricingOption2 />
      <ClientsOption2 />
    </div>
  );
}
