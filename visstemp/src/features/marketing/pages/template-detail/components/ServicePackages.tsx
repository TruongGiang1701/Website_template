import { AppLink } from "@/components/shared/app-link";
import type { PricingPlan } from "@/features/marketing/pages/home/home.data";

type ServicePackagesProps = {
  packages: PricingPlan[];
};

export function ServicePackages({ packages }: ServicePackagesProps) {
  return (
    <section>
      <h2 className="text-center text-2xl font-extrabold text-[#0f67be]">
        Gói dịch vụ có thể mua kèm
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {packages.map((pkg, idx) => (
          <article
            key={pkg.id}
            className="relative overflow-hidden rounded-2xl border border-[#d7e4f6] p-5 shadow-sm"
          >
            <div
              className={
                idx === 0
                  ? "absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(120,210,255,0.55),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(170,140,255,0.45),transparent_45%),#f8fbff]"
                  : "absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.65),transparent_42%),#f4f8ff]"
              }
            />
            <div className="relative">
              <h3 className="text-lg font-extrabold text-[#0a1f44]">{pkg.name}</h3>
              <p className="mt-1 text-xs font-semibold italic text-[#1b3a66]/75">
                {pkg.tagline}
              </p>

              <ul className="mt-4 space-y-2 text-sm font-semibold text-[#1b3a66]/85">
                {pkg.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-1 text-[#0f67be]">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <AppLink
                href={pkg.cta.href}
                className={
                  idx === 0
                    ? "mt-5 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#0f67be] to-[#2f8eee] px-5 text-xs font-extrabold text-white shadow-sm transition hover:brightness-95"
                    : "mt-5 inline-flex h-10 items-center justify-center rounded-full border border-[#0a1f44]/20 bg-white px-5 text-xs font-extrabold text-[#0a1f44] transition hover:bg-[#f4f8ff]"
                }
              >
                {pkg.cta.label}
              </AppLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
