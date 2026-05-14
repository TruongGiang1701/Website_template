"use client";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Divider } from "@/components/layout/divider";
import { homeShowcaseOption2 } from "@/features/marketing/pages/home/home.data";
import { Text } from "@/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ShowcaseOption2() {
  return (
    <Section
      spacing="md"
      className="bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_55%,#e4f1ff_100%)]"
    >
      <Stack className="items-center text-center" gap="md">
        <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight text-[#184983] sm:text-4xl">
          {homeShowcaseOption2.heading}
        </h2>
        <Text className="max-w-3xl text-sm text-[#2f4f7f] sm:text-base">
          {homeShowcaseOption2.description}
        </Text>
      </Stack>

      <Tabs
        defaultValue={homeShowcaseOption2.tabs[0]}
        className="mx-auto mt-8 max-w-4xl rounded-[1.25rem] border border-[#7ea9df] bg-white p-4 shadow-md sm:p-6"
      >
        <TabsList className="h-auto flex-wrap gap-2 bg-transparent p-0">
          {homeShowcaseOption2.tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-full border border-[#8ab0df] px-4 py-1.5 text-xs font-medium text-[#1a4f88] data-[state=active]:border-[#0b4f95] data-[state=active]:bg-[#0b4f95] data-[state=active]:text-white"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <Divider className="my-4 bg-transparent" />

        {homeShowcaseOption2.tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="rounded-[1.125rem] bg-gradient-to-r from-[#1f334e] via-[#234568] to-[#93b8db] p-5 shadow-sm sm:p-8">
              <div className="grid min-h-[14rem] gap-5 rounded-xl bg-black/20 p-4 text-left text-white shadow-inner sm:min-h-[16rem] sm:p-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/65">
                    search
                  </p>
                  <p className="text-3xl font-semibold leading-tight">
                    {homeShowcaseOption2.cardTitle}
                  </p>
                  <p className="text-lg text-white/80">
                    {homeShowcaseOption2.cardSubtitle}
                  </p>
                </div>
                <div className="mt-auto">
                  <button
                    type="button"
                    className="rounded-full border border-white/40 px-4 py-1 text-xs text-white/90"
                  >
                    download
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
