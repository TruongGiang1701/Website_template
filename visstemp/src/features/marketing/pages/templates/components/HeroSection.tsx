"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

export function HeroSection({
  className,
  breadcrumbCurrentLabel,
}: {
  className?: string;
  breadcrumbCurrentLabel?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/categories/template_website.jpg"
            alt="Danh sách mẫu Website & Landing Page"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.65),transparent_48%),linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.62)_44%,rgba(255,255,255,0)_72%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e4f6] bg-white/70 px-4 py-2 text-xs font-semibold text-[#1b4f86] shadow-sm backdrop-blur-sm">
                VISSTEMP
              </div>

              <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-[#194a84] sm:text-5xl lg:text-6xl">
                Danh sách mẫu{" "}
                <span className="bg-gradient-to-r from-[#2b61a6] to-[#d73f4f] bg-clip-text text-transparent">
                  Website
                </span>{" "}
                &amp;{" "}
                <span className="bg-gradient-to-r from-[#2b61a6] to-[#d73f4f] bg-clip-text text-transparent">
                  Landing Page
                </span>
                <br />
                Đủ mọi lĩnh vực
              </h1>

              <p className="max-w-xl text-sm font-semibold leading-relaxed text-[#2b5e95]/80 sm:text-base">
                Đặt hàng nhanh các mẫu website/landing page theo lĩnh vực phù hợp, tối
                ưu UI/UX, responsive, sẵn sàng triển khai.
              </p>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <div className="bg-white/95">
        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
          <Breadcrumbs currentLabel={breadcrumbCurrentLabel} />
        </div>
      </div>
    </div>
  );
}
