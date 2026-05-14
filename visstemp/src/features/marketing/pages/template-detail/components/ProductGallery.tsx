"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  title: string;
  images: string[];
};

export function ProductGallery({ title, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-[#d6e5f7] bg-white shadow-sm">
        <Image
          src={activeImage}
          alt={title}
          width={1200}
          height={780}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((image, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={`${image}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition",
                active
                  ? "border-[#0f67be] ring-2 ring-[#0f67be]/25"
                  : "border-[#d6e5f7] hover:border-[#9bc2ee]",
              )}
              aria-label={`Ảnh ${idx + 1}`}
            >
              <Image
                src={image}
                alt={`${title} - ảnh ${idx + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
