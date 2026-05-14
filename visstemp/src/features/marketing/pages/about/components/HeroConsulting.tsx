"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

export function HeroConsulting({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/categories/template_website.jpg"
            alt="Tư vấn miễn phí"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.62),transparent_52%),linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.62)_46%,rgba(255,255,255,0)_74%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-[#194a84] sm:text-5xl lg:text-6xl">
                Nhận tư vấn{" "}
                <span className="bg-gradient-to-r from-[#2b61a6] to-[#d73f4f] bg-clip-text text-transparent">
                  miễn phí
                </span>
                <br />
                từ các{" "}
                <span className="bg-gradient-to-r from-[#2b61a6] to-[#d73f4f] bg-clip-text text-transparent">
                  Chuyên gia
                </span>
                <br />
                của chúng tôi
              </h1>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <div className="bg-white/95">
        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
          <Breadcrumbs />
        </div>
      </div>
    </div>
  );
}
