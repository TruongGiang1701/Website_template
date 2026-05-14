import { Section } from "@/components/layout/section";
import BlueBackground from "@/components/ui/BlueBackground";
import { homeStatsOption2 } from "@/features/marketing/pages/home/home.data";

export function StatsOption2() {
  return (
    <Section spacing="sm" withContainer={false} className="py-0">
      <BlueBackground
        tone="soft"
        withWaves={false}
        className="w-full rounded-none border-y border-white/20 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:py-14"
        contentClassName="px-4 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mx-auto max-w-4xl text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {homeStatsOption2.heading}
          </h2>
        </div>
      </BlueBackground>
    </Section>
  );
}
