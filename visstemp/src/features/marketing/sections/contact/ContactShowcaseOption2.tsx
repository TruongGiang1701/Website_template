"use client";

import Image from "next/image";
import { useState } from "react";
import { Section } from "@/components/layout/section";
import { AppLink } from "@/components/shared/app-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BlueBackground from "@/components/ui/BlueBackground";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { homeContactOption2 } from "@/features/marketing/pages/home/home.data";

export function ContactShowcaseOption2() {
  const heroCards = homeContactOption2.projects.slice(0, 7);
  const [activeIndex, setActiveIndex] = useState(Math.floor(heroCards.length / 2));
  const slots = [-3, -2, -1, 0, 1, 2, 3] as const;

  return (
    <Section spacing="md" withContainer={false} className="py-0">
      <BlueBackground className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-10">
          <Badge className="border-white/25 bg-white/15 text-white">
            Liên hệ với chúng tôi
          </Badge>
          <h2 className="mt-4 text-balance text-3xl font-extrabold uppercase leading-tight text-[#d4e7ff] sm:text-5xl">
            {homeContactOption2.heading}
          </h2>
          <Text className="mx-auto mt-4 max-w-3xl text-pretty text-sm text-white/90 sm:text-base">
            {homeContactOption2.subheading}
          </Text>
          <Text className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-[#dbe8ff]">
            {homeContactOption2.caption}
          </Text>
        </div>

        <div className="mx-auto mt-14 w-full px-3 sm:px-6 lg:mt-16 lg:px-10">
          <div className="hidden h-[520px] overflow-hidden [perspective:1400px] lg:block">
            <div className="relative h-full w-full [transform-style:preserve-3d]">
              {heroCards.map((project, index) => {
                const rel = getCircularDelta(index, activeIndex, heroCards.length);
                const slot = slots.find((x) => x === rel);
                if (typeof slot === "undefined") return null;
                const style = getCarouselCardStyle(slot);
                const isActive = slot === 0;
                const depth = Math.min(3, Math.abs(slot));

                return (
                  <AppLink
                    key={project.id}
                    href={project.href}
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault();
                        setActiveIndex(index);
                      }
                    }}
                    className={cn(
                      "group absolute left-1/2 top-[58%] h-[460px] w-[320px] overflow-hidden rounded-2xl border bg-white/95 shadow-2xl",
                      "origin-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive
                        ? "border-white/60 ring-2 ring-white/35"
                        : "border-white/25 hover:border-white/40",
                    )}
                    style={style}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.55),transparent_55%)]" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={460}
                      height={720}
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-500",
                        "group-hover:scale-[1.05]",
                        isActive ? "scale-[1.02] brightness-100" : "brightness-[0.92]",
                        depth >= 2 ? "saturate-[0.9]" : "saturate-100",
                      )}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                      <p className="line-clamp-2 text-xs font-semibold text-white">
                        {project.title}
                      </p>
                    </div>
                  </AppLink>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#2f7ee1] via-[#2f7ee1]/55 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
            {heroCards.map((project) => (
              <AppLink
                key={project.id}
                href={project.href}
                className="group relative overflow-hidden rounded-xl border border-white/25 bg-white/10"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={360}
                  height={500}
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </AppLink>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-10">
          {homeContactOption2.team.map((member) => (
            <article
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-3 shadow-sm backdrop-blur-sm"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={64}
                height={64}
                className="size-14 rounded-full object-cover ring-2 ring-white/35"
              />
              <div>
                <p className="text-sm font-bold text-white">{member.name}</p>
                <p className="text-xs font-medium text-[#dbe8ff]">{member.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/25 bg-white/12 p-4 text-center shadow-md backdrop-blur-sm sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-semibold text-[#dce9ff]">
              Hotline: {homeContactOption2.phone}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#dce9ff]">
              Email: {homeContactOption2.email}
            </p>
          </div>
          <Button
            asChild
            className="contact-cta-button h-12 rounded-full bg-gradient-to-r from-[#3ea1ff] to-[#1f73de] px-8 text-sm font-extrabold text-white shadow-md hover:from-[#57adff] hover:to-[#2f80e6]"
          >
            <AppLink href={homeContactOption2.contactCta.href}>
              {homeContactOption2.contactCta.label}
            </AppLink>
          </Button>
        </div>
      </BlueBackground>
    </Section>
  );
}

function getCircularDelta(index: number, active: number, total: number) {
  let d = index - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

function getCarouselCardStyle(slot: -3 | -2 | -1 | 0 | 1 | 2 | 3) {
  const abs = Math.abs(slot);
  const dir = Math.sign(slot);

  const xMap = [0, 170, 300, 420];
  const yMap = [0, 10, 34, 70];
  const scaleMap = [1, 0.94, 0.86, 0.76];
  const rotateYMap = [0, 10, 18, 28];

  const x = xMap[abs] * dir;
  const y = yMap[abs];
  const scale = scaleMap[abs];
  const rotateY = rotateYMap[abs] * -dir;
  const zIndex = 50 - abs;

  return {
    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex,
  };
}
