"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AppLink } from "@/components/shared/app-link";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";
import {
  formatPrice,
  getTemplateDetailHref,
} from "@/features/marketing/pages/template-detail/template-detail.utils";
import { useFavorites } from "@/lib/useFavorites";
import { cn } from "@/lib/utils";

type RelatedProductsProps = {
  currentId: string;
  items: HomeTemplateItem[];
};

export function RelatedProducts({ currentId, items }: RelatedProductsProps) {
  const [query, setQuery] = useState("");
  const favorites = useFavorites();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => item.id !== currentId)
      .filter((item) => (q ? item.title.toLowerCase().includes(q) : true));
  }, [items, currentId, query]);

  return (
    <section>
      <h2 className="text-center text-2xl font-extrabold text-[#0f67be]">
        Mẫu Website thuộc chủ đề tương tự
      </h2>

      <div className="mx-auto mt-4 max-w-lg rounded-full border border-[#cfe0f7] bg-white p-1.5 shadow-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm mẫu tương tự"
          className="h-9 w-full rounded-full border-0 bg-transparent px-4 text-sm font-semibold text-[#1b3a66] outline-none placeholder:text-[#8aa3c4]"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.slice(0, 8).map((item) => {
          const liked = favorites.has(item.id);
          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-[#d7e4f6] bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <AppLink href={getTemplateDetailHref(item)} className="block">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={520}
                  height={360}
                  className="h-40 w-full object-cover"
                />
              </AppLink>

              <div className="space-y-3 p-3">
                <AppLink
                  href={getTemplateDetailHref(item)}
                  className="line-clamp-2 text-sm font-extrabold text-[#184983] hover:text-[#0f67be]"
                >
                  {item.title}
                </AppLink>

                <div className="flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={`${item.id}-${tag}`}
                      className="rounded-full border border-[#d4e2f4] px-2 py-0.5 text-[10px] font-semibold text-[#6f89a9]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#d93a3a]">
                    {formatPrice(item)}
                  </span>

                  <button
                    type="button"
                    aria-label={`Yêu thích ${item.title}`}
                    onClick={() => favorites.toggle(item.id)}
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-full transition-colors",
                      liked
                        ? "text-rose-500"
                        : "text-[#1b4f86]/70 hover:text-[#1b4f86]",
                    )}
                  >
                    <HeartIcon className="size-5" filled={liked} />
                  </button>
                </div>

                <AppLink
                  href={getTemplateDetailHref(item)}
                  className="inline-flex h-9 w-full items-center justify-center rounded-full border border-[#0f67be]/25 bg-white text-xs font-extrabold text-[#0f67be] transition hover:bg-[#eef5ff]"
                >
                  Chi tiết mẫu
                </AppLink>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HeartIcon({ className, filled }: { className?: string; filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      fill={filled ? "currentColor" : "none"}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" />
    </svg>
  );
}
