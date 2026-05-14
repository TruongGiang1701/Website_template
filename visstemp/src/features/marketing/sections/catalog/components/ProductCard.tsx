"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";

type Props = {
  item: HomeTemplateItem;
  liked: boolean;
  onToggleLike: () => void;
  onOpenModal: () => void;
  onTryWebsite?: () => void;
  onViewDetails?: () => void;
};

export function ProductCard({
  item,
  liked,
  onToggleLike,
  onOpenModal,
  onTryWebsite,
  onViewDetails,
}: Props) {
  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#d2e3f7] bg-white shadow-sm transition-transform hover:-translate-y-0.5"
      onClick={onOpenModal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenModal();
        }
      }}
    >
      <div className="relative">
        <Image
          src={item.image}
          alt={item.title}
          width={640}
          height={400}
          className="h-52 w-full object-cover"
        />

        <div
          className={cn(
            "absolute inset-0 flex items-end justify-center p-3",
            "bg-gradient-to-t from-black/60 via-black/20 to-transparent",
            "opacity-0 transition-all duration-300",
            "group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        >
          <div
            className={cn(
              "w-full max-w-[22rem] space-y-2",
              "translate-y-2 transition-transform duration-300",
              "group-hover:translate-y-0 group-focus-within:translate-y-0",
            )}
          >
            <Button
              className={cn(
                "h-10 w-full rounded-full text-xs font-extrabold",
                "bg-gradient-to-r from-[#0f67be] to-[#2f8eee] shadow-md",
                "transition-transform duration-300 hover:scale-[1.01]",
              )}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTryWebsite?.();
              }}
            >
              Trải nghiệm Website
              <ArrowRightIcon className="ml-1.5 size-4" />
            </Button>
            <Button
              variant="secondary"
              className={cn(
                "h-10 w-full rounded-full border border-white/60 bg-white/90 text-xs font-extrabold text-[#0a1f44]",
                "shadow-sm backdrop-blur-sm transition-transform duration-300 hover:scale-[1.01]",
              )}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.();
              }}
            >
              Chi tiết mẫu
              <ArrowUpIcon className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#184983]">
          {item.title}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={`${item.id}-${tag}`}
                className="rounded-full border border-[#d4e2f4] px-2 py-0.5 text-[10px] font-medium text-[#7a8eaa]"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            aria-label={`Yêu thích ${item.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
              liked ? "text-rose-500" : "text-[#1b4f86]/70 hover:text-[#1b4f86]",
            )}
          >
            <HeartIcon className="size-6" filled={liked} />
          </button>
        </div>
      </div>
    </article>
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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 19V5m0 0l-5 5m5-5l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
