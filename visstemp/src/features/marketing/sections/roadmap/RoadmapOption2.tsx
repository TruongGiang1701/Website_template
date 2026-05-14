import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Stack } from "@/components/layout/stack";
import { Divider } from "@/components/layout/divider";
import { RoadmapAmbientEffect } from "@/components/effects/RoadmapAmbientEffect";
import { Badge } from "@/components/ui/badge";
import BlueBackground from "@/components/ui/BlueBackground";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { homeRoadmapOption2 } from "@/features/marketing/pages/home/home.data";

const stepAccent: Record<(typeof homeRoadmapOption2.steps)[number]["id"], string> = {
  "01": "from-[#0f67be] to-[#2b8be4]",
  "02": "from-[#1d74d1] to-[#4da3ff]",
  "03": "from-[#0b4f95] to-[#0f67be]",
  "04": "from-[#0f67be] to-[#69b6ff]",
};

export function RoadmapOption2() {
  return (
    <Section spacing="md" withContainer={false} className="py-0">
      <BlueBackground tone="soft" withWaves className="py-14 sm:py-18">
        <RoadmapAmbientEffect />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Stack className="items-center text-center" gap="md">
            <Badge className="rounded-full border-white/25 bg-white/15 px-4 py-1 text-xs text-white backdrop-blur-sm">
              Quy trình triển khai
            </Badge>
            <h2 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {homeRoadmapOption2.heading}
            </h2>
            <Text className="max-w-3xl text-pretty text-sm text-white/90 sm:text-base">
              {homeRoadmapOption2.description}
            </Text>
          </Stack>

          <div className="mx-auto mt-10 max-w-7xl">
            <Grid cols={4} className="gap-4 lg:gap-5">
              {homeRoadmapOption2.steps.map((step, idx) => (
                <article
                  key={step.id}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-md backdrop-blur-md",
                    idx % 2 === 0 ? "bg-white/10" : "bg-white/15",
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b",
                      stepAccent[step.id],
                    )}
                  />
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15 text-sm font-extrabold text-white ring-1 ring-white/20">
                            {step.id}
                          </span>
                          <h3 className="text-sm font-bold text-white sm:text-base">
                            {step.title}
                          </h3>
                        </div>
                        <Text className="mt-2 text-xs text-white/85 sm:text-sm">
                          {step.lead}
                        </Text>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/90">
                        {step.outcome}
                      </span>
                    </div>

                    <Divider className="my-4 bg-white/15" />

                    <ul className="space-y-2">
                      {step.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-2 text-xs text-white/90 sm:text-sm"
                        >
                          <span
                            className={cn(
                              "mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
                              "bg-gradient-to-b",
                              stepAccent[step.id],
                            )}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          <span className="text-pretty">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </Grid>

            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-4 text-center shadow-xs backdrop-blur-md sm:p-5">
              <p className="text-xs font-semibold text-white/90 sm:text-sm">
                Gợi ý: Nếu bạn đã có Figma, chúng ta có thể rút ngắn bước 2 và tập trung
                nhiều hơn vào bước 3 (phát triển + tối ưu).
              </p>
            </div>
          </div>
        </div>
      </BlueBackground>
    </Section>
  );
}
