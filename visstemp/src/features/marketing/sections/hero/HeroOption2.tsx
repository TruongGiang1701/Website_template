import { AppLink } from "@/components/shared/app-link";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { homeHeroOption2 } from "@/features/marketing/pages/home/home.data";

export function HeroOption2() {
  return (
    <section className="relative overflow-hidden rounded-b-[2.75rem] border-b border-[#9cc7eb] bg-[#d6ebff] px-4 pb-14 pt-28 sm:pb-16 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/logos/logo_1.jpg')] bg-cover bg-center opacity-95" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(203,229,255,0.9)_0%,rgba(196,224,252,0.64)_48%,rgba(189,220,252,0.18)_100%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-[42rem] space-y-6 text-left">
          <h1 className="text-balance text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="text-[#0f5fae]">{homeHeroOption2.titlePrefix} </span>
            <span className="bg-gradient-to-r from-[#0e66bf] to-[#265fb8] bg-clip-text text-transparent">
              {homeHeroOption2.titleHighlight}
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#2c5eb0] via-[#334f9f] to-[#e23f4f] bg-clip-text text-transparent">
              {homeHeroOption2.titleSuffix}
            </span>
          </h1>

          <Text className="max-w-2xl text-sm font-medium text-[#285c97] sm:text-base">
            {homeHeroOption2.description}
          </Text>

          <ul className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#2f5f99] sm:text-sm">
            {homeHeroOption2.benefits.map((benefit) => (
              <li
                key={benefit}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/65 bg-white/45 px-3 py-1 shadow-sm backdrop-blur-sm"
              >
                <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#0f67be] text-[10px] text-white">
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <Button
            asChild
            className="h-12 rounded-full bg-gradient-to-r from-[#0f67be] to-[#2f8eee] px-7 text-sm font-extrabold text-white shadow-md hover:from-[#0d5da9] hover:to-[#297fd6]"
          >
            <AppLink href={homeHeroOption2.cta.href} className="gap-2">
              {homeHeroOption2.cta.label}
              <span className="inline-flex size-6 items-center justify-center rounded-full border border-white/60 bg-white/20 text-white">
                →
              </span>
            </AppLink>
          </Button>

          <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-[#2a5a90] sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/70 shadow-sm">
                V
              </span>
              VISSSOFT
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/70 shadow-sm">
                V
              </span>
              VISSTEMP
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/70 shadow-sm">
                V
              </span>
              VISSSOFT MEDIA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
