"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HomeTemplateItem } from "@/features/marketing/pages/home/home.data";

type Props = {
  isOpen: boolean;
  item: HomeTemplateItem | null;
  liked: boolean;
  onClose: () => void;
  onToggleLike: () => void;
};

export function ProductModal({ isOpen, item, liked, onClose, onToggleLike }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const price = item.price ?? "12.000.000 VND";
  const tags = item.tags.slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-[32rem] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
          "transition-all duration-300",
          "animate-in fade-in zoom-in-95 md:zoom-in-90",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-3 pb-0 sm:p-4 sm:pb-0">
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={item.image}
              alt={item.title}
              width={860}
              height={680}
              className="h-[23rem] w-full scale-[1.02] object-cover brightness-[0.72] saturate-75 sm:h-[25rem] md:h-[27rem]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-black/25" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          </div>

          <div className="absolute inset-x-0 bottom-5 flex justify-center px-7 sm:bottom-6 sm:px-8">
            <div className="w-full space-y-3">
              <Button
                type="button"
                className="h-14 w-full rounded-full bg-gradient-to-r from-[#0f67be] to-[#2f8eee] text-[1.05rem] font-extrabold shadow-lg"
              >
                Trải nghiệm Website
                <span className="ml-2 inline-flex size-10 items-center justify-center rounded-full bg-white text-[#2f67cc]">
                  <ArrowRightIcon className="size-5" />
                </span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-14 w-full rounded-full border border-white/80 bg-white text-[1.05rem] font-extrabold text-[#17426f] shadow-lg"
              >
                Chi tiết mẫu
                <span className="ml-2 inline-flex size-10 items-center justify-center rounded-full bg-[#1f63db] text-white">
                  <ArrowRightIcon className="size-5" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5 pt-4 sm:px-6 sm:pb-6">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={`${item.id}-${tag}`}
                className="rounded-full border border-[#d4e2f4] bg-white px-3 py-1 text-[11px] font-semibold text-[#2f5c93]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-pretty text-base font-extrabold leading-6 text-[#0a1f44]">
            {item.title}
          </h3>

          <div className="flex items-center justify-between text-[2rem] font-extrabold leading-none">
            <span className="text-[2rem] text-[#d62828]">Giá:</span>
            <span className="text-[2rem] text-[#d62828]">{price}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0f67be] to-[#2f8eee] text-xl font-extrabold text-white shadow-md transition hover:brightness-95"
            >
              <CartIcon className="size-5" />
              Mua ngay
            </button>
            <button
              type="button"
              aria-label="Yêu thích"
              onClick={onToggleLike}
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-2xl transition",
                liked ? "text-[#e30613]" : "text-[#0a1f44]/70 hover:text-[#0a1f44]",
              )}
            >
              <HeartIcon className="size-8" filled={liked} />
            </button>
          </div>
        </div>
      </div>
    </div>
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

function CartIcon({ className }: { className?: string }) {
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
      <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8a2 2 0 0 1-2-1.6L4 3H2" />
      <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
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
