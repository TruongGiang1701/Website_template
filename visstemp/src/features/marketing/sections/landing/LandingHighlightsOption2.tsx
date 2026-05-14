"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Section } from "@/components/layout/section";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";
import { homeLandingHighlightsOption2 } from "@/features/marketing/pages/home/home.data";

const toneClass = {
  blue: "from-[#0f4cb4] via-[#1e66d1] to-[#5fb1ff]",
  deep: "from-[#0c3552] via-[#124f6f] to-[#1c7aa5]",
  purple: "from-[#4f1fae] via-[#6a37cc] to-[#7f6dff]",
} as const;

function SliderMarks({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <div className="mt-8 flex items-center gap-4">
      {Array.from({ length: total }).map((_, idx) => (
        <span
          key={`mark-${idx}`}
          className={cn(
            "h-[3px] rounded-full transition-all duration-300",
            idx === activeIndex ? "w-20 bg-white/85" : "w-14 bg-white/35",
          )}
        />
      ))}
    </div>
  );
}

export function LandingHighlightsOption2() {
  const sections = homeLandingHighlightsOption2.sections;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDragging: false, startX: 0, startScroll: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const maxIndex = sections.length - 1;
    const nextIndex = Math.max(0, Math.min(index, maxIndex));
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: nextIndex * width,
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (!clientWidth) return;
    const nextActiveIndex = Math.round(scrollLeft / clientWidth);
    if (nextActiveIndex !== activeIndex) {
      setActiveIndex(nextActiveIndex);
    }
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!containerRef.current) return;
    containerRef.current.setPointerCapture(event.pointerId);
    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      startScroll: containerRef.current.scrollLeft,
    };
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!containerRef.current || !dragState.current.isDragging) return;
    const distance = event.clientX - dragState.current.startX;
    containerRef.current.scrollLeft = dragState.current.startScroll - distance;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    if (!containerRef.current || !dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (!clientWidth) return;
    const snappedIndex = Math.round(scrollLeft / clientWidth);
    scrollToIndex(snappedIndex);
  };

  return (
    <Section spacing="sm" withContainer={false} className="py-0">
      <div className="relative overflow-hidden py-2">
        <div
          ref={containerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {sections.map((section) => (
            <article
              key={section.id}
              className="min-w-full snap-start px-2 sm:px-4 lg:px-6"
            >
              <div className="overflow-hidden rounded-[2rem]">
                <div
                  className={cn(
                    "relative overflow-hidden bg-gradient-to-r",
                    toneClass[section.tone],
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.1),transparent_45%)]" />
                  <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:url('/images/bg/noise.png')]" />

                  <div className="relative mx-auto grid w-full max-w-[96rem] gap-10 px-6 py-12 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-16 lg:py-16">
                    <div className="space-y-4 text-white">
                      <h2 className="max-w-md text-balance text-4xl font-extrabold leading-tight md:text-5xl">
                        {section.title}
                      </h2>
                      <p className="max-w-md text-sm text-white/85 md:text-base">
                        {section.description}
                      </p>
                      <AppLink
                        href={section.ctaHref}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#0f4cb4] shadow-md transition-transform hover:scale-[1.02]"
                      >
                        {section.ctaLabel}
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#0f67be] text-white">
                          →
                        </span>
                      </AppLink>
                      <SliderMarks total={sections.length} activeIndex={activeIndex} />
                    </div>

                    <div className="rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
                      <div className="relative overflow-hidden rounded-2xl">
                        <Image
                          src={section.image}
                          alt={section.title}
                          width={1100}
                          height={720}
                          className="aspect-[16/10] w-full object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={section.id === "template-vault"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between sm:inset-x-6 lg:inset-x-8">
          <button
            type="button"
            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/50 bg-white/30 text-white backdrop-blur-md transition hover:bg-white/45"
            onClick={() => scrollToIndex(activeIndex - 1)}
            aria-label="Slide trước"
          >
            ←
          </button>
          <button
            type="button"
            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/50 bg-white/30 text-white backdrop-blur-md transition hover:bg-white/45"
            onClick={() => scrollToIndex(activeIndex + 1)}
            aria-label="Slide tiếp theo"
          >
            →
          </button>
        </div>
      </div>
    </Section>
  );
}
