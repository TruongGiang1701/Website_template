import { homePricingOption2 } from "@/features/marketing/pages/home/home.data";
import { Section } from "@/components/layout/section";
import { AppLink } from "@/components/shared/app-link";

export function PricingOption2() {
  const [basic, premium, care] = homePricingOption2.plans;

  return (
    <Section spacing="md" withContainer={false} className="py-0">
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,#bdefff_0%,#e6fbff_30%,#f7fdff_60%,#ffffff_100%)]" />
          <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-[#6dd7ff]/35 blur-3xl" />
          <div className="absolute -right-40 top-10 size-[30rem] rounded-full bg-[#7aa7ff]/25 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-balance text-3xl font-extrabold text-[#0f67be] sm:text-4xl">
              {homePricingOption2.heading}
            </h2>
            <p className="text-sm font-semibold text-[#1b3a66]/70 sm:text-base">
              {homePricingOption2.description}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            <article className="rounded-2xl border border-black/10 bg-white/55 p-7 shadow-md backdrop-blur-sm">
              <p className="text-sm font-extrabold text-[#0a1f44]">{basic.name}</p>
              <p className="mt-2 text-xs font-semibold italic text-[#0a1f44]/70">
                {basic.tagline}
              </p>

              <div className="mt-6">
                <AppLink
                  href={basic.cta.href}
                  className="inline-flex w-full items-center justify-center rounded-full border border-black/35 bg-white/70 px-4 py-2 text-[11px] font-extrabold text-[#0a1f44] shadow-sm transition hover:bg-white"
                >
                  {basic.priceLabel}
                </AppLink>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-[#0a1f44]/80">
                {basic.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      ✓
                    </span>
                    <span className="text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="relative rounded-2xl border border-black/10 bg-white/55 p-7 shadow-lg backdrop-blur-sm">
              {premium.recommended ? (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#0f67be]/30 bg-white px-4 py-1 text-[11px] font-extrabold text-[#0f67be] shadow-sm">
                    <CrownIcon className="size-4" />
                    KHUYẾN DÙNG
                  </span>
                </div>
              ) : null}

              <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-white/35" />
                <div className="absolute -left-10 top-10 size-72 rounded-full bg-[#8fd7ff]/55 blur-2xl" />
                <div className="absolute right-0 top-16 size-80 rounded-full bg-[#b19bff]/55 blur-2xl" />
                <div className="absolute bottom-0 right-10 size-72 rounded-full bg-[#63ffe4]/45 blur-2xl" />
              </div>

              <p className="text-sm font-extrabold text-[#0a1f44]">{premium.name}</p>
              <p className="mt-2 text-xs font-semibold italic text-[#0a1f44]/70">
                {premium.tagline}
              </p>

              <div className="mt-6">
                <AppLink
                  href={premium.cta.href}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#0f67be] px-5 py-2.5 text-[12px] font-extrabold text-white shadow-md transition hover:bg-[#0f67be]/90"
                >
                  {premium.cta.label}
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-white text-[#0f67be]">
                    <ArrowIcon className="size-4" />
                  </span>
                </AppLink>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-[#0a1f44]/85">
                {premium.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0f67be] text-white">
                      ✓
                    </span>
                    <span className="text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>

              {premium.giftNote ? (
                <div className="mt-8 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#0f67be]/20 bg-white/80 px-4 py-2 text-[11px] font-extrabold text-[#0f67be] shadow-sm">
                    <GiftIcon className="size-4" />
                    {premium.giftNote}
                  </span>
                </div>
              ) : null}
            </article>

            <article className="rounded-2xl border border-black/10 bg-white/55 p-7 shadow-md backdrop-blur-sm">
              <p className="text-sm font-extrabold text-[#0a1f44]">{care.name}</p>
              <p className="mt-2 text-xs font-semibold italic text-[#0a1f44]/70">
                {care.tagline}
              </p>

              <div className="mt-6">
                <AppLink
                  href={care.cta.href}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-5 py-2.5 text-[12px] font-extrabold text-white shadow-md transition hover:bg-black/90"
                >
                  {care.cta.label}
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-white text-black">
                    <ArrowIcon className="size-4" />
                  </span>
                </AppLink>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-[#0a1f44]/85">
                {care.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      ✓
                    </span>
                    <span className="text-pretty">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </Section>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 7l4 4 5-7 5 7 4-4v10H3V7z" />
      <path d="M5 19h14" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 12v10H4V12" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7h4a2 2 0 0 0 0-4c-1.5 0-2.5 1-4 4Z" />
      <path d="M12 7H8a2 2 0 0 1 0-4c1.5 0 2.5 1 4 4Z" />
    </svg>
  );
}
